# Fonctionnalités (Frontend)

## 🔐 AUTHENTIFICATION & GESTION DES UTILISATEURS

### Utilisateurs (clients ou admin)

* [ ] 🔒 Inscription (client)
* [x] 🔒 Connexion (JWT ou autre)
* [x] 🔒 Déconnexion (côté front, mais refresh côté backend)
* [ ] 🔁 Refresh token (si besoin)
* [ ] 🔧 Modifier ses informations personnelles
* [ ] 🔧 Modifier son mot de passe
* [ ] 🔧 Réinitialisation de mot de passe (si tu veux le faire un jour)
* [ ] 🔍 Admin : liste des utilisateurs
* [ ] ❌ Admin : suppression de comptes

---

## 🛍️ PRODUITS

* [x] 📄 Récupérer la liste des produits (filtrés par catégorie)
* [x] 📄 Récupérer un produit par ID
* [ ] ✅ Ajouter un produit (admin)
* [ ] 🔧 Modifier un produit (admin)
* [ ] ❌ Supprimer un produit (admin)

---

## 🧴 PRESTATIONS

* [x] 📄 Récupérer la liste des prestations (par catégorie)
* [x] 📄 Récupérer une prestation par ID
* [x] ✅ Ajouter une prestation (admin)
* [x] 🔧 Modifier une prestation (admin)
* [x] ❌ Supprimer une prestation (admin)

---

## 📅 DISPONIBILITÉS

* [ ] 📄 Récupérer les disponibilités de la semaine
* [ ] ✅ Ajouter une plage horaire disponible (admin)
* [ ] 🔧 Modifier une disponibilité (admin)
* [ ] ❌ Supprimer une disponibilité (admin)

Qui retourne les créneaux disponibles calculés dynamiquement.

---

## 📆 RÉSERVATIONS

* [x] ✅ Prendre rendez-vous (client)
* [x] 📄 Lister ses propres réservations (client)
* [ ] 📄 Admin : lister toutes les réservations
* [ ] 🔧 Modifier un rendez-vous (client ou admin)
* [ ] ❌ Annuler un rendez-vous (client ou admin)
* [ ] 🔁 Admin : changer le statut (confirmé / annulé)

---

## 🛒 ACHATS DE PRODUITS

* [x] 📄 Lister ses achats (client)
* [ ] 📄 Admin : lister tous les achats
* [ ] ✅ Effectuer un achat (client) — sans paiement en ligne, juste une commande
* [ ] 🔁 Admin : changer le statut (livré / annulé)

---

## 📚 CATÉGORIES (Produits & Prestations)

* [ ] 📄 Lister toutes les catégories
* [ ] ✅ Ajouter une catégorie (admin)
* [ ] 🔧 Modifier une catégorie (admin)
* [ ] ❌ Supprimer une catégorie (admin)

---

## 💬 TÉMOIGNAGES / AVIS

* [ ] 📄 Lister les témoignages (public)
* [ ] ✅ Ajouter un témoignage (client)
* [ ] ❌ Supprimer/modérer un témoignage (admin)

---

## 🖼️ GALERIE (Photos & Vidéos)

* [ ] 📄 Lister les médias (public)
* [ ] ✅ Ajouter un média (admin)
* [ ] ❌ Supprimer un média (admin)

---

## 📨 NEWSLETTER (optionnel)

* [ ] ✅ S’inscrire à la newsletter
* [ ] ❌ Se désinscrire
* [ ] 📤 Admin : envoyer une newsletter (si fait depuis back)

---

## 🛠️ ADMIN DASHBOARD (API utilisée par le front admin)

* [ ] 📊 Statistiques simples : nb de réservations, nb d’achats, chiffre d’affaires estimé, créneaux disponibles
* [ ] 🔍 Rechercher par nom/email/date dans les réservations ou achats
