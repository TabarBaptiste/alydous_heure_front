<template>
    <div class="container mt-5" v-if="prestation">
        <!-- Détails prestation -->
        <h2 class="mb-3">{{ prestation.titre }}</h2>
        <p class="lead">{{ prestation.description }}</p>
        <p><strong>Prix :</strong> {{ prestation.prix }} €</p>
        <p><strong>Durée :</strong> {{ prestation.duree }} min</p>
        <hr />

        <div v-if="isLoggedIn">
            <div v-if="message" class="mt-3 alert" :class="messageType">
                {{ message }}
            </div>
            <h4>Choisissez un jour</h4>
            <div class="mb-4">
                <button v-for="day in next7Days" :key="day.iso" class="btn me-2 mb-2"
                    :class="day === selectedDay ? 'btn-primary' : 'btn-outline-secondary'" :disabled="!day.hasSlot"
                    @click="selectDay(day)">
                    {{ day.label }}
                </button>
            </div>

            <div v-if="selectedDay">
                <h5>Créneaux pour {{ selectedDay.label }}</h5>
                <div class="d-flex flex-wrap mb-3">
                    <button v-for="slot in availableSlots" :key="slot.start" class="btn me-2 mb-2"
                        :class="slot === selectedSlot ? 'btn-success' : 'btn-outline-primary'" :disabled="slot.disabled"
                        @click="selectSlot(slot)">
                        {{ slot.start }} – {{ slot.end }}
                    </button>
                </div>
            </div>

            <div v-if="loading">
                <div class="loader"></div>
            </div>
            <button v-else class="btn btn-primary" :disabled="!selectedSlot" @click="reserver">
                Réserver
            </button>

        </div>

        <div v-else class="alert alert-warning">
            Vous devez être connecté pour réserver.
        </div>
    </div>
    <div v-else class="container mt-5">
        <div class="loader"></div>
    </div>
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
    buildNext7Days()
})

// 1) Génère les 7 prochains jours avec date en local
function buildNext7Days() {
    const joursShortFr = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    const joursFrFull = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
    const today = new Date()

    for (let i = 0; i < 7; i++) {
        // crée une date locale sans décalage UTC
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
        const name = joursFrFull[d.getDay()]
        const plages = allWeekSlots.value[name] || []

        // on génère vite un petit check : y a-t-il au moins un slot non disabled ?
        const hasSlot = plages.some(({ start, end }) => {
            const startMs = new Date(d.getFullYear(), d.getMonth(), d.getDate(), ...start.split(':').map(Number)).getTime()
            const endMs = new Date(d.getFullYear(), d.getMonth(), d.getDate(), ...end.split(':').map(Number)).getTime()
            return endMs > Date.now() // et tu pourrais aussi comparer à durée prestation + pause
        })

        if (!hasSlot) continue

        const iso = d.toISOString().slice(0, 10)
        const label = `${joursShortFr[d.getDay()]} ${d.getDate()}`
        next7Days.value.push({ date: d, iso, label, name, hasSlot })
    }
}


function hasSlots(dayDate) {
    return true
}

// 2) Au clic sur un jour
async function selectDay(day) {
    selectedDay.value = day
    selectedSlot.value = null
    availableSlots.value = await computeSlotsForDate(day)
}

// 3) Génère et filtre les créneaux
async function computeSlotsForDate({ date, iso }) {
    let reserved = []
    try {
        reserved = (await api.get('/reservation/date', { params: { date: iso } })).data
    } catch { }

    const plages = allWeekSlots.value[dateName(date)] || []
    const durMin = prestation.value.duree + 5
    const nowMs = Date.now()
    const slots = []

    for (const { start, end } of plages) {
        let cur = new Date(date.getFullYear(), date.getMonth(), date.getDate(), ...start.split(':').map(Number))
        const plageEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), ...end.split(':').map(Number)).getTime()

        while (cur.getTime() + prestation.value.duree * 60000 <= plageEnd) {
            const s = cur.toTimeString().slice(0, 5)
            const eMs = cur.getTime() + prestation.value.duree * 60000
            const e = new Date(eMs).toTimeString().slice(0, 5)

            const dsp = cur.getTime() < nowMs
            const conflict = reserved.some(r => {
                const rs = new Date(`${iso}T${r.start}`).getTime()
                const re = new Date(`${iso}T${r.end}`).getTime()
                return !(eMs <= rs || cur.getTime() >= re)
            })

            slots.push({ start: s, end: e, disabled: dsp || conflict })
            cur = new Date(cur.getTime() + durMin * 60000)
        }
    }
    return slots
}

function dateName(d) {
    const jours = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
    return jours[d.getDay()]
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
