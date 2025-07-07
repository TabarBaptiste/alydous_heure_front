<template>
    <div class="container mt-5">
        <h2 class="mb-4">Gestion des exceptions de disponibilité</h2>
        <FullCalendar :options="calendarOptions" />

        <!-- Modal d'ajout/édition -->
        <div class="modal fade" id="exceptionModal" tabindex="-1" ref="modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ editing ? 'Modifier' : 'Ajouter' }} une exception</h5>
                        <button type="button" class="btn-close" @click="closeModal()"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveException">
                            <div class="mb-3">
                                <label class="form-label">Date</label>
                                <input type="date" v-model="form.date" class="form-control" required />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Début (optionnel)</label>
                                <input type="time" v-model="form.start" class="form-control" />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Fin (optionnel)</label>
                                <input type="time" v-model="form.end" class="form-control" />
                            </div>
                            <div class="mb-3 form-check">
                                <input type="checkbox" v-model="form.is_disponible" class="form-check-input"
                                    id="isException" />
                                <label class="form-check-label" for="isException">Disponible ce jour</label>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Commentaire</label>
                                <input type="text" v-model="form.commentaire" class="form-control"
                                    placeholder="(ex: Absence, jour férié)" />
                            </div>
                            <button type="submit" class="btn btn-primary">
                                {{ editing ? 'Enregistrer' : 'Ajouter' }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
// import '@fullcalendar/core/vdom'
import { ref, onMounted } from 'vue'
import { Modal } from 'bootstrap'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import api from '@/services/api'

const calendarPlugins = [dayGridPlugin, interactionPlugin]
const events = ref([])
const form = ref({ id: null, date: '', start: '', end: '', is_disponible: false, commentaire: '' })
const editing = ref(false)
let bsModal = null

onMounted(async () => {
    await fetchExceptions()
    bsModal = new Modal(document.getElementById('exceptionModal'))
})

function handleDateClick(info) {
    alert(`Date cliquée : ${info.dateStr}`)
}

async function fetchExceptions() {
    const res = await api.get('/exceptions')
    events.value = res.data.map(e => ({
        id: e.id,
        title: e.is_disponible ? 'Ouvert' : (e.commentaire || 'Fermé'),
        start: e.start ? `${e.date}T${e.start}` : e.date,
        end: e.end ? `${e.date}T${e.end}` : e.date,
        backgroundColor: e.is_disponible ? '#28a745' : '#dc3545'
    }))
}

function onDateClick(info) {
    editing.value = false
    form.value = { id: null, date: info.dateStr, start: '', end: '', is_disponible: false, commentaire: '' }
    bsModal.show()
}

function onEventClick(info) {
    const ev = events.value.find(e => e.id == info.event.id)
    editing.value = true
    form.value = { ...ev, date: info.event.startStr.slice(0, 10), start: info.event.startStr.includes('T') ? info.event.startStr.slice(11, 16) : '', end: info.event.endStr && info.event.endStr.includes('T') ? info.event.endStr.slice(11, 16) : '', is_disponible: ev.backgroundColor === '#28a745', commentaire: ev.title }
    bsModal.show()
}

function onEventDrop(info) {
    // déplacer : update date
    updateByDrag(info.event)
}

function onEventResize(info) {
    // étendre : update end
    updateByDrag(info.event)
}

async function updateByDrag(event) {
    await api.put(`/exceptions/${event.id}`, {
        date: event.startStr.slice(0, 10),
        start: event.startStr.includes('T') ? event.startStr.slice(11, 16) : null,
        end: event.endStr && event.endStr.includes('T') ? event.endStr.slice(11, 16) : null,
        is_disponible: event.backgroundColor === '#28a745'
    })
    fetchExceptions()
}

function closeModal() {
    bsModal.hide()
}

async function saveException() {
    if (editing.value) {
        await api.put(`/exceptions/${form.value.id}`, {
            date: form.value.date,
            start: form.value.start || null,
            end: form.value.end || null,
            is_disponible: form.value.is_disponible,
            commentaire: form.value.commentaire
        })
    } else {
        await api.post('/exceptions', {
            date: form.value.date,
            start: form.value.start || null,
            end: form.value.end || null,
            is_disponible: form.value.is_disponible,
            commentaire: form.value.commentaire
        })
    }
    await fetchExceptions()
    closeModal()
}


const calendarOptions = ref({
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: events.value,
    editable: true,
    selectable: true,
    dateClick: onDateClick,
    eventClick: onEventClick,
    eventDrop: onEventDrop,
    eventResize: onEventResize,
})
</script>

<style scoped>
.container {
    max-width: 900px;
}
</style>
