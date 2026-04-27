document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([41.9981, 21.4254], 13);
    const detailsPanel = document.getElementById('aqDetails');
    let currentReport = null;
    let draftMarker = null;
    let markers = {};

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    function openSheet() {
        currentReport = null;
        if (draftMarker) {
            map.removeLayer(draftMarker);
            draftMarker = null;
        }
        document.getElementById('sheetTitle').textContent = 'Create New Report';
        document.getElementById('sheetSubTitle').textContent = 'Choose a report type to get started.';
        document.getElementById('reportDescriptionL').value = '';
        document.getElementById('reportFullCheckboxL').checked = false;
        document.getElementById('reportImageL').value = '';
        document.getElementById('previewImageL').src = '';
        document.getElementById('previewImageL').classList.add('hidden');
        document.getElementById('reportDescriptionD').value = '';
        document.getElementById('reportFullCheckboxD').checked = false;
        document.getElementById('selectedTypeLabel').textContent = '';
        document.getElementById('selectedTypeLabelD').textContent = '';
        document.getElementById('reportSelect').classList.remove('hidden');
        document.getElementById('reportFormL').classList.add('hidden');
        document.getElementById('reportFormD').classList.add('hidden');
        document.querySelectorAll('.report-type').forEach(btn => btn.classList.remove('selected'));
        document.getElementById('reportSheet').classList.remove('hidden');
    }

    function closeSheet() {
        document.getElementById('reportSheet').classList.add('hidden');
        if (draftMarker) {
            map.removeLayer(draftMarker);
            draftMarker = null;
        }
    }

    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function previewReportImage(event) {
        const file = event.target.files[0];
        if (!file) return;
        readFileAsDataURL(file).then(url => {
            const preview = document.getElementById('previewImageL');
            preview.src = url;
            preview.classList.remove('hidden');
            if (currentReport) {
                currentReport.imageUrl = url;
            }
        });
    }

    function setLandfillTag(tag, button) {
        if (!currentReport || currentReport.type !== 'landfill') return;
        currentReport.tag = tag;
        document.querySelectorAll('.severity-button').forEach(btn => btn.classList.remove('active'));
        if (button) button.classList.add('active');
    }

    function updateSeverityLabel(value) {
        const severityLabel = document.getElementById('severityValue');
        if (severityLabel) severityLabel.textContent = value;
        if (currentReport && currentReport.type === 'landfill') {
            currentReport.severity = Number(value);
        }
    }

    function openSuccessSheet() {
        document.getElementById('reportSuccessSheet').classList.remove('hidden');
    }

    function closeSuccessSheet() {
        document.getElementById('reportSuccessSheet').classList.add('hidden');
    }

    function gotoTrack() {
        window.location.href = 'Track.html';
    }

    function selectCategory(category, button) {
        currentReport = {
            type: category === 'Illegal Landfill' ? 'landfill' : 'dumpster',
            label: category,
            description: '',
            urgent: false,
            imageUrl: null,
            latitude: null,
            longitude: null
        };

        document.querySelectorAll('.report-type').forEach(btn => btn.classList.remove('selected'));
        if (button) button.classList.add('selected');

        const formId = currentReport.type === 'landfill' ? 'reportFormL' : 'reportFormD';
        document.getElementById('selectedTypeLabel').textContent = `${category} selected`;
        if (currentReport.type === 'dumpster') {
            document.getElementById('selectedTypeLabelD').textContent = `${category} selected`;
        }
        document.getElementById('reportSelect').classList.add('hidden');
        document.getElementById('reportFormL').classList.add('hidden');
        document.getElementById('reportFormD').classList.add('hidden');
        document.getElementById(formId).classList.remove('hidden');
        document.getElementById('sheetTitle').textContent = 'Report details';
        document.getElementById('sheetSubTitle').textContent = 'Tap the map to place the pin and add details.';
    }

    function createPinIcon(pinData) {
        const emoji = pinData.type === 'landfill' ? '♻️' : '🗑️';
        const badgeColor = pinData.type === 'landfill' ? '#84c046' : '#42a5f5';
        const urgentClass = pinData.urgent ? ' urgent' : '';
        const iconHtml = `
            <div class="pin-icon ${pinData.type}${urgentClass}" style="--pin-color:${badgeColor}">
                <div class="pin-badge">${emoji}</div>
                <div class="pin-tail"></div>
            </div>
        `;

        return L.divIcon({
            className: 'custom-pin-icon',
            html: iconHtml,
            iconSize: [36, 46],
            iconAnchor: [18, 46],
            popupAnchor: [0, -42]
        });
    }

    async function confirmReport() {
        if (!currentReport) {
            alert('Please choose a report type first.');
            return;
        }

        const descriptionId = currentReport.type === 'landfill' ? 'reportDescriptionL' : 'reportDescriptionD';
        const checkboxId = currentReport.type === 'landfill' ? 'reportFullCheckboxL' : 'reportFullCheckboxD';
        const imageId = 'reportImageL';

        const description = document.getElementById(descriptionId).value.trim();
        const urgent = document.getElementById(checkboxId).checked;
        const imageFile = currentReport.type === 'landfill' ? document.getElementById(imageId).files[0] : null;

        if (!description) {
            alert('Please add a short description or location.');
            return;
        }

        if (!currentReport.latitude || !currentReport.longitude) {
            alert('Tap the map to place the report pin.');
            return;
        }

        let imageUrl = currentReport.imageUrl || null;
        if (currentReport.type === 'landfill' && imageFile && !imageUrl) {
            imageUrl = await readFileAsDataURL(imageFile);
        }

        const severity = currentReport.type === 'landfill' ? (currentReport.severity || Number(document.getElementById('reportSeverityL').value)) : null;
        const tag = currentReport.type === 'landfill' ? currentReport.tag || 'General' : null;

        const reportData = {
            type: currentReport.type,
            title: currentReport.label,
            description,
            urgent,
            imageUrl,
            latitude: currentReport.latitude,
            longitude: currentReport.longitude,
            status: 'Reported',
            severity,
            tag,
            timestamp: new Date()
        };

        try {
            const docRef = await window.db.collection('pins').add(reportData);
            addPinToMap(reportData, docRef.id);
            closeSheet();
            openSuccessSheet();
        } catch (error) {
            console.error('Error saving report:', error);
            alert('Unable to save report. Try again.');
        }
    }

    function addPinToMap(pinData, id) {
        // Validate coordinates exist
        if (!pinData.latitude || !pinData.longitude) {
            console.warn('Pin missing coordinates:', pinData);
            return;
        }

        const marker = L.marker([pinData.latitude, pinData.longitude], {
            icon: createPinIcon(pinData)
        }).addTo(map);

        const popupParts = [`<strong>${pinData.title}</strong>`, `<p>${pinData.description}</p>`];
        if (pinData.imageUrl) {
            popupParts.push(`<img src="${pinData.imageUrl}" style="width:180px;border-radius:14px;margin-top:8px;" />`);
        }
        if (pinData.urgent) {
            popupParts.push(`<em style="color:#d32f2f;">Urgent</em>`);
        }

        marker.bindPopup(popupParts.join(''));

        marker.on('click', () => {
            marker.openPopup();
        });

        if (id) {
            markers[id] = marker;
        }
    }

    window.openSheet = openSheet;
    window.closeSheet = closeSheet;
    window.openSuccessSheet = openSuccessSheet;
    window.closeSuccessSheet = closeSuccessSheet;
    window.gotoTrack = gotoTrack;
    window.selectCategory = selectCategory;
    window.setLandfillTag = setLandfillTag;
    window.updateSeverityLabel = updateSeverityLabel;
    window.confirmReport = confirmReport;
    window.previewReportImage = previewReportImage;

    document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
        item.addEventListener('click', (event) => {
            document.querySelectorAll('.bottom-nav .nav-item').forEach(nav => nav.classList.remove('active'));
            event.currentTarget.classList.add('active');
        });
    });

    window.onclick = function(event) {
        const sheet = document.getElementById('reportSheet');
        if (event.target === sheet) {
            closeSheet();
        }
    }

    map.on('click', function(e) {
        if (currentReport) {
            currentReport.latitude = e.latlng.lat;
            currentReport.longitude = e.latlng.lng;

            if (draftMarker) {
                draftMarker.setLatLng(e.latlng);
            } else {
                draftMarker = L.circleMarker(e.latlng, {
                    radius: 10,
                    fillColor: '#4caf50',
                    color: '#fff',
                    weight: 2,
                    fillOpacity: 0.9
                }).addTo(map);
            }

            const activeFormId = currentReport.type === 'landfill' ? 'reportFormL' : 'reportFormD';
            if (document.getElementById(activeFormId).classList.contains('hidden')) {
                return;
            }

            const labelId = currentReport.type === 'landfill' ? 'selectedTypeLabel' : 'selectedTypeLabelD';
            document.getElementById(labelId).textContent = `Location set: ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;
        }
    });

    window.db.collection('pins').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                const pinData = change.doc.data();
                const pinId = change.doc.id;
                addPinToMap(pinData, pinId);
            }
            if (change.type === 'modified') {
                // optionally update existing pin here
            }
            if (change.type === 'removed') {
                const pinId = change.doc.id;
                if (markers[pinId]) {
                    map.removeLayer(markers[pinId]);
                    delete markers[pinId];
                }
            }
        });
    });
});

