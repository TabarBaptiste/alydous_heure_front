<template>
    <div class="container mt-5">
        <h1 class="mb-4">Tableau de bord administrateur</h1>
        <div class="row g-4">
            <!-- Réservations -->
            <div class="col-12 col-md-6 col-lg-4">
                <router-link to="/admin/reservations" class="text-decoration-none">
                    <div class="card h-100 shadow-sm hover-shadow">
                        <div class="card-body d-flex flex-column justify-content-center align-items-center">
                            <i class="bi bi-calendar-check mb-3" style="font-size: 2rem;"></i>
                            <h5 class="card-title">Toutes les Réservations</h5>
                        </div>
                    </div>
                </router-link>
            </div>
            <!-- Achats -->
            <div class="col-12 col-md-6 col-lg-4">
                <router-link to="/admin/achats" class="text-decoration-none">
                    <div class="card h-100 shadow-sm hover-shadow">
                        <div class="card-body d-flex flex-column justify-content-center align-items-center">
                            <i class="bi bi-basket-fill mb-3" style="font-size: 2rem;"></i>
                            <h5 class="card-title">Tous les Achats</h5>
                        </div>
                    </div>
                </router-link>
            </div>
            <!-- Utilisateurs -->
            <div class="col-12 col-md-6 col-lg-4">
                <router-link to="/admin/user" class="text-decoration-none">
                    <div class="card h-100 shadow-sm hover-shadow">
                        <div class="card-body d-flex flex-column justify-content-center align-items-center">
                            <i class="bi bi-people-fill mb-3" style="font-size: 2rem;"></i>
                            <h5 class="card-title">Tous les Utilisateurs</h5>
                        </div>
                    </div>
                </router-link>
            </div>
            <!-- Disponibilités -->
            <div class="col-12 col-md-6 col-lg-4">
                <router-link to="/admin/disponibilites" class="text-decoration-none">
                    <div class="card h-100 shadow-sm hover-shadow">
                        <div class="card-body d-flex flex-column justify-content-center align-items-center">
                            <i class="bi bi-clock-fill mb-3" style="font-size: 2rem;"></i>
                            <h5 class="card-title">Toutes les Disponibilités</h5>
                        </div>
                    </div>
                </router-link>
            </div>
            <!-- Catégories -->
            <div class="col-12 col-md-6 col-lg-4">
                <router-link to="/admin/categories" class="text-decoration-none">
                    <div class="card h-100 shadow-sm hover-shadow">
                        <div class="card-body d-flex flex-column justify-content-center align-items-center">
                            <i class="bi bi-tags-fill mb-3" style="font-size: 2rem;"></i>
                            <h5 class="card-title">Toutes les Catégories</h5>
                        </div>
                    </div>
                </router-link>
            </div>
            <!-- Statistiques -->
            <div class="col-12 col-md-6 col-lg-4">
                <router-link to="/admin/statistiques" class="text-decoration-none">
                    <div class="card h-100 shadow-sm hover-shadow">
                        <div class="card-body d-flex flex-column justify-content-center align-items-center">
                            <i class="bi bi-bar-chart-line-fill mb-3" style="font-size: 2rem;"></i>
                            <h5 class="card-title">Statistiques</h5>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script setup>
// Aucun script nécessaire pour l'instant
</script>

<style scoped>
.hover-shadow {
    transition: box-shadow 0.2s ease-in-out;
}

.hover-shadow:hover {
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.card {
    border-radius: 0.75rem;
}

.card-title {
    font-size: 1.1rem;
    font-weight: 500;
}
</style>
