 ____________Space Odyssey — Plateforme éducative interactive______________


 _______Présentation_________
 
- Space Odyssey est une plateforme web interactive dédiée à la découverte des missions spatiales et de l’astronomie. Après une première version statique HTML/CSS, cette nouvelle mouture offre une expérience utilisateur enrichie grâce à l’intégration de fonctionnalités dynamiques en JavaScript.

__________Fonctionnalités principales___________

____Validation de formulaires___

- Vérification des champs requis de formulaire contact

- Styles évolutifs selon la validité du champ

___Recherche et filtrage avancés___

- Barre de recherche avec filtrage par nom, agence, objectif ou date de lancement

- Filtres multiples : agence, année , nom de mission

- Possibilité de combiner filtres et texte

___Gestion CRUD complète___

- Ajout de missions.

- Édition directe des cartes mission.

- Suppression avec confirmation.

- Affichage dynamique.

___Système de favoris___

- Bouton “Ajouter aux favoris” sur chaque mission

- Section “Favoris” affichant les éléments marqués

- Retrait possible des favoris

- Persistance des favoris (localStorage)

___Gestion d’événements___

- Interactions par clic sur cartes, boutons, liens

- Changement de vues (“Toutes les missions”, “Favoris”, “Mes missions”)

- Soumission, validation, réinitialisation des formulaires

- Navigation entièrement dynamique, sans rechargement de page

___Technologies utilisées___

-HTML5, CSS3 (Flexbox, Grid).

- JavaScript (ES6+).

- LocalStorage pour la persistance locale.

___Structure du projet___

/index.html : page d’accueil et structure principale

/missions.html : page interactive des missions.

/planets.html : page des planets avec leur information.

/about.html : page contient les informations global du site

/contact.html : page contient une formulaire avec des champs de validation.

/assets/ : images, icônes et ressources visuelles.

/style/ : fichiers CSS du projet.

/script/ : scripts JavaScript (gestion missions, formulaires, favoris…).


Ce README vise à fournir toutes les clés pour comprendre, utiliser et contribuer efficacement au projet éducatif interactif Space Odyssey.
