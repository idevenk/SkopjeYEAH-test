
var map = L.map('map').setView([41.9981, 21.4254], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

function openModal() {
    document.getElementById('reportModal').style.display = 'block';
}

function selectCategory(category) {
    alert("You selected: " + category + ". Now drag the pin to your location.");
    document.getElementById('reportModal').style.display = 'none';
    
}
