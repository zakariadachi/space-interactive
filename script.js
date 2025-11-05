// ===============================
// Projet : Missions Spatiales Interactives
// Objectif : Manipuler le DOM, gÃ©rer des donnÃ©es JSON,
// et ajouter des fonctionnalitÃ©s dynamiques avec JavaScript.
// ===============================

// --- DonnÃ©es principales ---
// ==================== DATA ==================== 
// ==================== DATA ==================== 
let missions = [];

async function loadMissions() {
    try {
        const response = await fetch("missions.json");
        missions = await response.json();

        // Initialize favorites after loading missions
        initializeMissions();
        fillYearFilter();
        displayMissions(missions);
    } catch (error) {
        console.error("Erreur lors du chargement des missions :", error);
        const container = document.getElementById('missionsContainer');
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #ff4757;"><i class="fas fa-exclamation-triangle"></i><p>Error loading missions. Please check that missions.json is in the correct location.</p></div>';
    }
}

// ==================== STATE MANAGEMENT ====================
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentFilter = {
    search: '',
    agency: 'all',
    year: 'all',
    sort: 'newest'
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function () {
    loadMissions();
    setupEventListeners();
});

function initializeMissions() {
    missions.forEach(mission => {
        mission.favorite = favorites.some(fav => fav.id === mission.id);
    });
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentFilter.search = this.value.toLowerCase();
            applyFilters();
        }, 300);
    });

    document.getElementById('favoritesBtn').addEventListener('click', showFavorites);

    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function () {
            this.closest('.modal').style.display = 'none';
        });
    });

    window.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
}

// ==================== DISPLAY FUNCTIONS ====================
function displayMissions(missionsList) {
    const container = document.getElementById('missionsContainer');
    const noResults = document.getElementById('noResults');

    if (missionsList.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'flex';
        return;
    }

    noResults.style.display = 'none';
    container.innerHTML = '';

    missionsList.forEach(mission => {
        const card = createMissionCard(mission);
        container.appendChild(card);
    });
}

function createMissionCard(mission) {
    const card = document.createElement('div');
    card.className = 'mission-card';
    card.dataset.id = mission.id;

    const favoriteClass = mission.favorite ? 'fas' : 'far';
    const favoriteColor = mission.favorite ? 'style="color: #ff4757;"' : '';

    card.innerHTML = `
        <div class="mission-image" style="background-image: url('${mission.image}');">
            <button class="favorite-btn" onclick="toggleFavorite(${mission.id})" ${favoriteColor}>
                <i class="${favoriteClass} fa-heart"></i>
            </button>
            <div class="mission-actions">
                <button class="action-btn edit-btn" onclick="editMission(${mission.id})" title="Edit Mission">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete-btn" onclick="confirmDelete(${mission.id})" title="Delete Mission">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <div class="mission-info">
            <h3>${mission.name}</h3>
            <div class="mission-meta">
                <span class="agency-badge"><i class="fas fa-globe"></i> ${mission.agency}</span>
                <span class="date-badge"><i class="fas fa-calendar"></i> ${mission.launchDate}</span>
            </div>
            <p>${mission.objective}</p>
            <button class="read-more-btn" onclick="showMissionDetails(${mission.id})">
                Read More <i class="fas fa-arrow-right"></i>
            </button>
        </div>
    `;

    return card;
}

// ==================== FILTER FUNCTIONS ====================
function fillYearFilter() {
    const yearFilter = document.getElementById('yearFilter');
    const years = [...new Set(missions.map(m => m.year))].sort((a, b) => b - a);

    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearFilter.appendChild(option);
    });
}

function applyFilters() {
    currentFilter.agency = document.getElementById('agencyFilter').value;
    currentFilter.year = document.getElementById('yearFilter').value;
    currentFilter.sort = document.getElementById('sortFilter').value;

    let filtered = missions.filter(mission => {
        const matchesSearch = currentFilter.search === '' ||
            mission.name.toLowerCase().includes(currentFilter.search) ||
            mission.objective.toLowerCase().includes(currentFilter.search) ||
            mission.agency.toLowerCase().includes(currentFilter.search);

        const matchesAgency = currentFilter.agency === 'all' ||
            mission.agency === currentFilter.agency;

        const matchesYear = currentFilter.year === 'all' ||
            mission.year.toString() === currentFilter.year;

        return matchesSearch && matchesAgency && matchesYear;
    });

    filtered = sortMissions(filtered, currentFilter.sort);
    displayMissions(filtered);
}

function sortMissions(missionsList, sortType) {
    const sorted = [...missionsList];

    switch (sortType) {
        case 'newest':
            return sorted.sort((a, b) => b.year - a.year);
        case 'oldest':
            return sorted.sort((a, b) => a.year - b.year);
        case 'name':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        default:
            return sorted;
    }
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('agencyFilter').value = 'all';
    document.getElementById('yearFilter').value = 'all';
    document.getElementById('sortFilter').value = 'newest';

    currentFilter = {
        search: '',
        agency: 'all',
        year: 'all',
        sort: 'newest'
    };

    displayMissions(missions);
}

// ==================== EDIT FUNCTIONALITY ====================
function editMission(missionId) {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    // Populate the form
    document.getElementById('editMissionId').value = mission.id;
    document.getElementById('editName').value = mission.name;
    document.getElementById('editAgency').value = mission.agency;

    // Convert the text date to YYYY-MM-DD format for date input
    const dateObj = new Date(mission.launchDate);
    const formattedDate = dateObj.toISOString().split('T')[0];
    document.getElementById('editLaunchDate').value = formattedDate;

    document.getElementById('editObjective').value = mission.objective;
    document.getElementById('editDetails').value = mission.details || '';

    // Show the modal
    document.getElementById('editModal').style.display = 'block';
}

function saveEdit() {
    const missionId = parseInt(document.getElementById('editMissionId').value);
    const mission = missions.find(m => m.id === missionId);

    if (!mission) return;

    // Get the date input value and convert it
    const dateInput = document.getElementById('editLaunchDate').value;
    const dateObj = new Date(dateInput);

    // Format: "Month Day, Year"
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);
    const year = dateObj.getFullYear();

    // Update mission data
    mission.name = document.getElementById('editName').value;
    mission.agency = document.getElementById('editAgency').value;
    mission.launchDate = formattedDate;
    mission.year = year;
    mission.objective = document.getElementById('editObjective').value;
    mission.details = document.getElementById('editDetails').value;

    // Update localStorage favorites if this mission is favorited
    if (mission.favorite) {
        const favIndex = favorites.findIndex(f => f.id === missionId);
        if (favIndex !== -1) {
            favorites[favIndex] = { ...mission };
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }

    // Close modal and refresh display
    document.getElementById('editModal').style.display = 'none';
    applyFilters();

    // Show success message
    showNotification('Mission updated successfully!', 'success');
}

function cancelEdit() {
    document.getElementById('editModal').style.display = 'none';
}


// ==================== DELETE FUNCTIONALITY ====================
function confirmDelete(missionId) {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    document.getElementById('deleteMissionName').textContent = mission.name;
    document.getElementById('confirmDeleteBtn').onclick = () => deleteMission(missionId);
    document.getElementById('deleteModal').style.display = 'block';
}

function deleteMission(missionId) {
    // Remove from missions array
    missions = missions.filter(m => m.id !== missionId);

    // Remove from favorites if exists
    favorites = favorites.filter(f => f.id !== missionId);
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Close modal and refresh display
    document.getElementById('deleteModal').style.display = 'none';
    applyFilters();

    // Show success message
    showNotification('Mission deleted successfully!', 'error');
}

function cancelDelete() {
    document.getElementById('deleteModal').style.display = 'none';
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'trash'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ==================== FAVORITES SYSTEM ====================
function toggleFavorite(missionId) {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    mission.favorite = !mission.favorite;

    if (mission.favorite) {
        if (!favorites.some(f => f.id === missionId)) {
            favorites.push(mission);
        }
    } else {
        favorites = favorites.filter(f => f.id !== missionId);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
    applyFilters();
}

function showFavorites() {
    const modal = document.getElementById('favoritesModal');
    const favoritesList = document.getElementById('favoritesList');

    if (favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="no-favorites">
                <i class="far fa-heart"></i>
                <p>You haven't added any favorite missions yet.</p>
                <small>Click the heart icon on any mission to add it to your favorites!</small>
            </div>
        `;
    } else {
        favoritesList.innerHTML = '';
        favorites.forEach(mission => {
            const card = createFavoriteCard(mission);
            favoritesList.appendChild(card);
        });
    }

    modal.style.display = 'block';
}

function createFavoriteCard(mission) {
    const card = document.createElement('div');
    card.className = 'favorite-card';
    card.innerHTML = `
        <img src="${mission.image}" alt="${mission.name}">
        <div class="favorite-info">
            <h4>${mission.name}</h4>
            <p><strong>Agency:</strong> ${mission.agency}</p>
            <p><strong>Launch:</strong> ${mission.launchDate}</p>
            <div class="favorite-actions">
                <button onclick="showMissionDetails(${mission.id})" class="view-btn">
                    <i class="fas fa-eye"></i> View
                </button>
                <button onclick="removeFavorite(${mission.id})" class="remove-btn">
                    <i class="fas fa-trash"></i> Remove
                </button>
            </div>
        </div>
    `;
    return card;
}

function removeFavorite(missionId) {
    toggleFavorite(missionId);
    showFavorites();
}

// ==================== MODAL FUNCTIONS ====================
function showMissionDetails(missionId) {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    const modal = document.getElementById('missionModal');
    document.getElementById('modalImage').style.backgroundImage = `url('${mission.image}')`;
    document.getElementById('modalTitle').textContent = mission.name;
    document.getElementById('modalAgency').innerHTML = `<i class="fas fa-globe"></i> ${mission.agency}`;
    document.getElementById('modalDate').innerHTML = `<i class="fas fa-calendar"></i> ${mission.launchDate}`;
    document.getElementById('modalDescription').textContent = mission.details || mission.objective;

    modal.style.display = 'block';
}


document.addEventListener("DOMContentLoaded", function () {
    // Autres setups...

    // Ouvrir modal ajout mission
    document.getElementById("addMissionBtn").addEventListener("click", function () {
        document.getElementById("addModal").style.display = "block";
    });

    // Fermer modal ajout
    document.getElementById("addCloseBtn").addEventListener("click", cancelAdd);

    // autres initialisations...
});

// Fonction pour fermer modal ajout
function cancelAdd() {
    document.getElementById("addModal").style.display = "none";
    document.getElementById("addForm").reset();
}

// Fonction pour enregistrer nouvelle mission
function saveNewMission() {
    const name = document.getElementById("addName").value.trim();
    const agency = document.getElementById("addAgency").value;
    const launchDate = document.getElementById("addLaunchDate").value;
    const objective = document.getElementById("addObjective").value.trim();
    const details = document.getElementById("addDetails").value.trim();

    if (!name || !agency || !launchDate || !objective) {
        alert("Veuillez remplir tous les champs obligatoires.");
        return;
    }

    const maxId = missions.reduce((max, m) => Math.max(max, m.id), 0);
    const newMission = {
        id: maxId + 1,
        name: name,
        agency: agency,
        launchDate: new Date(launchDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
        year: new Date(launchDate).getFullYear(),
        objective: objective,
        details: details,
        favorite: false,
        image: "default_image_url_here"
    };

    missions.push(newMission);
    cancelAdd();
    applyFilters();
    showNotification("Mission ajoutée avec succès !", "success");
}

// contact-validation.js

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function (e) {
        // Récupérer les champs
        const firstName = document.getElementById('firstname');
        const lastName = document.getElementById('lastname');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const message = document.getElementById('message');
        const subject = document.querySelector('input[name="subject"]:checked');

        // Regex
        const nameRegex = /^[a-zA-ZÀ-ÿ' -]{2,}$/;
        const emailRegex = /^[\\w-.]+@[\\w-]+\\.[a-z]{2,}$/i;
        const phoneRegex = /^\\+?\\d{9,15}$/;

        // Validation
        let errors = [];

        if (!nameRegex.test(firstName.value.trim())) {
            errors.push('Prénom invalide (2 caractères minimum, lettres uniquement).');
        }
        if (!nameRegex.test(lastName.value.trim())) {
            errors.push('Nom invalide (2 caractères minimum, lettres uniquement).');
        }
        if (!emailRegex.test(email.value.trim())) {
            errors.push('Email invalide.');
        }
        if (!phoneRegex.test(phone.value.trim())) {
            errors.push('Numéro de téléphone invalide (9 à 15 chiffres).');
        }
        if (!message.value.trim()) {
            errors.push('Message requis.');
        }
        if (!subject) {
            errors.push('Sélectionnez un sujet.');
        }

        // Affichage des erreurs ou soumission
        if (errors.length > 0) {
            e.preventDefault();
            alert(errors.join('\\n'));
        }
    });
});
