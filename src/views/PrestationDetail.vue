<template>
    <div class="container mt-5" v-if="prestation">
        <!-- Détails prestation -->
        <h2 class="mb-3">{{ prestation.titre }}</h2>
        <p class="lead">{{ prestation.description }}</p>
        <p><strong>Prix :</strong> {{ prestation.prix }} €</p>
        <p><strong>Durée :</strong> {{ prestation.duree }} min</p>
        <hr />

        <div v-if="isLoggedIn">
            <h4>Choisissez un jour</h4>
            <div class="mb-4">
                <button v-for="day in next7Days" :key="day.iso" class="btn me-2 mb-2"
                    :class="day === selectedDay ? 'btn-primary' : 'btn-outline-secondary'"
                    :disabled="!hasSlots(day.date)" @click="selectDay(day)">
                    {{ day.label }}
                </button>
            </div>

            <div v-if="selectedDay">
                <h5>Créneaux pour le {{ selectedDay.label }}</h5>
                <div class="d-flex flex-wrap mb-3">
                    <button v-for="slot in availableSlots" :key="slot.start" class="btn me-2 mb-2"
                        :class="slot === selectedSlot ? 'btn-success' : 'btn-outline-primary'" :disabled="slot.disabled"
                        @click="() => selectSlot(slot)">
                        {{ slot.start }} – {{ slot.end }}
                    </button>
                </div>
            </div>

            <button class="btn btn-primary" :disabled="!selectedSlot || loading" @click="reserver">
                {{ loading ? 'Réservation…' : 'Réserver' }}
            </button>

            <div v-if="message" class="mt-3 alert" :class="messageType">
                {{ message }}
            </div>
        </div>

        <div v-else class="alert alert-warning">
            Vous devez être connecté pour réserver.
        </div>
    </div>
    <div v-else class="container mt-5">Chargement…</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api.js'
import { useAuth } from '../composables/useAuth'

// État
const route = useRoute()
const prestation = ref(null)
const next7Days = ref([])      // { date: Date, iso: 'YYYY-MM-DD', label: 'Lun 16' }
const selectedDay = ref(null)    // parmi next7Days
const availableSlots = ref([])    // [{start,end,disabled}]
const selectedSlot = ref(null)
const loading = ref(false)
const message = ref('')
const messageType = ref('')
const { isLoggedIn } = useAuth()

// 1) Charger prestation + dispos hebdo
const allWeekSlots = ref({})
const availableDays = ref([])

onMounted(async () => {
    const id = route.params.id
    const [pRes, dRes] = await Promise.all([
        api.get(`/prestation/${id}`),
        api.get('/disponibilites')
    ])
    prestation.value = pRes.data
    allWeekSlots.value = dRes.data
    availableDays.value = Object.keys(allWeekSlots.value)
    buildNext7Days()
})

// Générer les 7 prochains jours
function buildNext7Days() {
    const joursShortFr = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    const joursFrFull = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

    for (let i = 0; i < 7; i++) {
        const d = new Date()
        d.setDate(d.getDate() + i)
        const fullName = joursFrFull[d.getDay()]
        // ne garder que si la BDD a une entrée pour ce jour
        if (!availableDays.value.includes(fullName)) continue

        const iso = d.toISOString().slice(0, 10)
        const label = `${joursShortFr[d.getDay()]} ${d.getDate()}`
        next7Days.value.push({ date: new Date(iso), iso, label, fullName })
    }
}


function hasSlots(dayDate) {
    return true
}

// Au clic sur un jour
async function selectDay(day) {
    selectedDay.value = day
    selectedSlot.value = null
    availableSlots.value = await computeSlotsForDate(day.date)
}

// Génère et filtre les créneaux pour une date
async function computeSlotsForDate(dateObj) {
    const dateStr = dateObj.toISOString().slice(0, 10)
    // 1) récupérer réservations
    let reserved = []
    try {
        reserved = (await api.get('/reservation', { params: { date: dateStr } })).data
    } catch { }
    // 2) récupérer plages hebdo pour ce jour
    const joursFr = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
    const dayName = joursFr[dateObj.getDay()]
    const dayPlages = allWeekSlots.value[dayName] || []
    // 3) générer créneaux
    const durMin = prestation.value.duree + 5
    const nowMs = Date.now()
    const slots = []
    for (const { start, end } of dayPlages) {
        let cur = new Date(`${dateStr}T${start}`)
        const plageEnd = new Date(`${dateStr}T${end}`).getTime()
        while (cur.getTime() + prestation.value.duree * 60000 <= plageEnd) {
            const s = cur.toTimeString().slice(0, 5)
            const eMs = cur.getTime() + prestation.value.duree * 60000
            const e = new Date(eMs).toTimeString().slice(0, 5)
            // vérifier passé
            const dsp = cur.getTime() < nowMs
            // vérifier chevauchement
            const conflict = reserved.some(r => {
                const rs = new Date(`${dateStr}T${r.start}`).getTime()
                const re = new Date(`${dateStr}T${r.end}`).getTime()
                return !(eMs <= rs || cur.getTime() >= re)
            })
            slots.push({ start: s, end: e, disabled: dsp || conflict })
            cur = new Date(cur.getTime() + durMin * 60000)
        }
    }
    return slots
}

// Sélectionne un slot
function selectSlot(slot) {
    if (!slot.disabled) selectedSlot.value = slot
}

// Envoi la réservation
async function reserver() {
    loading.value = true
    try {
        await api.post('/reservation', {
            prestation_id: prestation.value.id,
            date: selectedDay.value.iso,
            startTime: selectedSlot.value.start
        })
        message.value = 'Réservation confirmée ! 🎉'
        messageType.value = 'alert-success'
        // raffraîchir créneaux
        await selectDay(selectedDay.value)
    } catch (e) {
        message.value = e.response?.data?.error || 'Erreur'
        messageType.value = 'alert-danger'
    } finally {
        loading.value = false
    }
}
</script>
