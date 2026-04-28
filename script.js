document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([41.9981, 21.4254], 13);
    const detailsPanel = document.getElementById('aqDetails');
    let currentReport = null;
    let draftMarker = null;
    let markers = {};
    let userLocation = null;
    const REPORTER_ID_STORAGE_KEY = 'skopjeyeah_reporter_id';
    const WAQI_TOKEN = '920a3bd0416aa65f6fde1957372621a3a4013597';

    function getReporterId() {
        let id = localStorage.getItem(REPORTER_ID_STORAGE_KEY);
        if (!id) {
            id = `reporter-${Math.random().toString(36).slice(2)}-${Date.now()}`;
            localStorage.setItem(REPORTER_ID_STORAGE_KEY, id);
        }
        return id;
    }

    const reporterId = getReporterId();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    function getEl(id) {
        return document.getElementById(id);
    }

    function safeSetValue(id, value) {
        const el = getEl(id);
        if (el) el.value = value;
    }

    function safeSetChecked(id, checked) {
        const el = getEl(id);
        if (el) el.checked = checked;
    }

    function safeSetText(id, text) {
        const el = getEl(id);
        if (el) el.textContent = text;
    }

    function safeToggleClass(id, className, add) {
        const el = getEl(id);
        if (el) {
            if (add) el.classList.add(className);
            else el.classList.remove(className);
        }
    }

    function openSheet() {
        currentReport = null;
        if (draftMarker) {
            map.removeLayer(draftMarker);
            draftMarker = null;
        }

        safeSetText('sheetTitle', window.i18n?.t('createNewReport') || 'Create New Report');
        safeSetText('sheetSubTitle', window.i18n?.t('chooseReportType') || 'Choose a report type to get started.');
        safeSetValue('reportDescriptionL', '');
        safeSetChecked('reportFullCheckboxL', false);
        safeSetValue('reportImageL', '');
        safeSetValue('reportImageD', '');
        document.querySelectorAll('.preview-image').forEach(img => {
            img.src = '';
            img.classList.add('hidden');
        });
        safeSetValue('reportDescriptionD', '');
        safeSetChecked('reportFullCheckboxD', false);
        safeSetText('selectedTypeLabel', '');
        safeSetText('selectedTypeLabelD', '');

        const reportSelect = getEl('reportSelect');
        if (reportSelect) reportSelect.classList.remove('hidden');
        const reportFormL = getEl('reportFormL');
        if (reportFormL) reportFormL.classList.add('hidden');
        const reportFormD = getEl('reportFormD');
        if (reportFormD) reportFormD.classList.add('hidden');
        document.querySelectorAll('.report-type').forEach(btn => btn.classList.remove('selected'));
        const reportSheet = getEl('reportSheet');
        if (reportSheet) reportSheet.classList.remove('hidden');
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

    function parseRational(view, offset, littleEndian) {
        const numerator = view.getUint32(offset, littleEndian);
        const denominator = view.getUint32(offset + 4, littleEndian);
        return denominator ? numerator / denominator : 0;
    }

    function readAsciiString(view, offset, length) {
        let value = '';
        for (let i = 0; i < length; i++) {
            const charCode = view.getUint8(offset + i);
            if (charCode === 0) break;
            value += String.fromCharCode(charCode);
        }
        return value;
    }

    function parseExifGps(buffer) {
        const view = new DataView(buffer);
        if (view.getUint16(0) !== 0xFFD8) return null;

        let offset = 2;
        while (offset < view.byteLength) {
            if (view.getUint8(offset) !== 0xFF) return null;
            const marker = view.getUint8(offset + 1);
            const size = view.getUint16(offset + 2, false);
            if (marker === 0xE1) {
                const exifHeader = readAsciiString(view, offset + 4, 6);
                if (exifHeader !== 'Exif\0\0') return null;
                const tiffOffset = offset + 10;
                const littleEndian = view.getUint16(tiffOffset) === 0x4949;
                const firstIFDOffset = view.getUint32(tiffOffset + 4, littleEndian);
                const ifd0Offset = tiffOffset + firstIFDOffset;
                const entries = view.getUint16(ifd0Offset, littleEndian);
                let gpsOffset = null;

                for (let i = 0; i < entries; i++) {
                    const entryOffset = ifd0Offset + 2 + i * 12;
                    const tag = view.getUint16(entryOffset, littleEndian);
                    if (tag === 0x8825) {
                        gpsOffset = view.getUint32(entryOffset + 8, littleEndian);
                        break;
                    }
                }

                if (!gpsOffset) return null;
                const gpsIFDOffset = tiffOffset + gpsOffset;
                const gpsEntries = view.getUint16(gpsIFDOffset, littleEndian);
                let latRef, lonRef, latOffset, lonOffset;

                for (let i = 0; i < gpsEntries; i++) {
                    const entryOffset = gpsIFDOffset + 2 + i * 12;
                    const tag = view.getUint16(entryOffset, littleEndian);
                    const type = view.getUint16(entryOffset + 2, littleEndian);
                    const count = view.getUint32(entryOffset + 4, littleEndian);
                    const valueOffset = type === 2 && count <= 4
                        ? entryOffset + 8
                        : tiffOffset + view.getUint32(entryOffset + 8, littleEndian);

                    if (tag === 1) {
                        latRef = readAsciiString(view, valueOffset, count);
                    }
                    if (tag === 3) {
                        lonRef = readAsciiString(view, valueOffset, count);
                    }
                    if (tag === 2) {
                        latOffset = valueOffset;
                    }
                    if (tag === 4) {
                        lonOffset = valueOffset;
                    }
                }

                if (!latRef || !lonRef || !latOffset || !lonOffset) return null;

                const latDegrees = parseRational(view, latOffset, littleEndian);
                const latMinutes = parseRational(view, latOffset + 8, littleEndian);
                const latSeconds = parseRational(view, latOffset + 16, littleEndian);
                const lonDegrees = parseRational(view, lonOffset, littleEndian);
                const lonMinutes = parseRational(view, lonOffset + 8, littleEndian);
                const lonSeconds = parseRational(view, lonOffset + 16, littleEndian);

                let lat = latDegrees + latMinutes / 60 + latSeconds / 3600;
                let lon = lonDegrees + lonMinutes / 60 + lonSeconds / 3600;
                if (latRef === 'S') lat = -lat;
                if (lonRef === 'W') lon = -lon;
                return { lat, lng: lon };
            }
            offset += 2 + size;
        }

        return null;
    }

    async function getGpsFromFile(file) {
        if (!file || !file.type.startsWith('image/')) return null;
        try {
            const buffer = await file.arrayBuffer();
            const coords = parseExifGps(buffer);
            return coords;
        } catch (error) {
            console.warn('Unable to read image EXIF data:', error);
            return null;
        }
    }

    async function handleReportImageInput(event) {
        const file = event.target.files[0];
        if (!file) return;

        const url = await readFileAsDataURL(file);
        const preview = event.target.closest('.report-step')?.querySelector('.preview-image');
        if (preview) {
            preview.src = url;
            preview.classList.remove('hidden');
        }

        if (!currentReport) {
            currentReport = {
                type: null,
                label: '',
                description: '',
                urgent: false,
                imageUrl: url,
                latitude: null,
                longitude: null,
                locationSource: null,
                reporterId
            };
        } else {
            currentReport.imageUrl = url;
            if (!currentReport.reporterId) {
                currentReport.reporterId = reporterId;
            }
        }

        const coords = await getGpsFromFile(file);
        if (coords) {
            setReportLocation(coords.lat, coords.lng, 'image');
        }
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

    function getAqiStatus(aqi) {
        if (aqi <= 50) return 'Good';
        if (aqi <= 100) return 'Moderate';
        if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
        if (aqi <= 200) return 'Unhealthy';
        if (aqi <= 300) return 'Very Unhealthy';
        return 'Hazardous';
    }

    function setLocalAqBanner(text, color = '#4caf50') {
        const banner = document.getElementById('localAqBanner');
        if (!banner) return;
        banner.textContent = text;
        banner.style.backgroundColor = color;
        banner.classList.remove('hidden');
    }

    async function loadLocalAirQuality(lat, lng) {
        try {
            const response = await fetch(`https://api.waqi.info/feed/geo:${lat};${lng}/?token=${WAQI_TOKEN}`);
            const json = await response.json();
            if (json.status === 'ok') {
                const aqi = json.data.aqi;
                const status = getAqiStatus(aqi);
                const color = aqi <= 50 ? '#4caf50' : aqi <= 100 ? '#ffeb3b' : aqi <= 150 ? '#ff9800' : aqi <= 200 ? '#f44336' : aqi <= 300 ? '#9c27b0' : '#4a148c';
                setLocalAqBanner(`Air quality near you: ${aqi} (${status})`, color);
                if (aqi > 100 && 'Notification' in window && Notification.permission === 'granted') {
                    new Notification('Poor Air Quality Alert', {
                        body: `AQI: ${aqi} (${status}). Consider staying indoors.`,
                        icon: 'logo.svg'
                    });
                }
            } else {
                setLocalAqBanner('Air quality data is unavailable for your location.', '#9e9e9e');
            }
        } catch (error) {
            setLocalAqBanner('Unable to fetch local air quality.', '#9e9e9e');
            console.error(error);
        }
    }

    function setReportLocation(lat, lng, source = 'map') {
        if (!currentReport) return;
        if (currentReport.locationSource === 'image' && source !== 'image') {
            return;
        }

        currentReport.latitude = lat;
        currentReport.longitude = lng;
        currentReport.locationSource = source;
        const latlng = L.latLng(lat, lng);
        if (draftMarker) {
            draftMarker.setLatLng(latlng);
        } else {
            draftMarker = L.circleMarker(latlng, {
                radius: 10,
                fillColor: '#4caf50',
                color: '#fff',
                weight: 2,
                fillOpacity: 0.9
            }).addTo(map);
        }

        const labelId = currentReport.type === 'landfill' ? 'selectedTypeLabel' : 'selectedTypeLabelD';
        const label = document.getElementById(labelId);
        if (label) {
            label.textContent = `${window.i18n?.t('locationSet') || 'Location set:'} ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        }
    }

    function requestUserLocation() {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(position => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setView([userLocation.lat, userLocation.lng], 13);
            L.circleMarker([userLocation.lat, userLocation.lng], {
                radius: 12,
                fillColor: '#f44336',
                color: '#000',
                weight: 3,
                fillOpacity: 0.9
            }).addTo(map).bindPopup('You are here');
            loadLocalAirQuality(userLocation.lat, userLocation.lng);
        }, error => {
            console.warn('Geolocation unavailable:', error);
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    function openSuccessSheet() {
        document.getElementById('reportSuccessSheet').classList.remove('hidden');
    }

    function isResolvedOrSolvedStatus(status) {
        return status === 'Resolved' || status === 'Solved';
    }

    function cleanupOldResolvedReports() {
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        window.db.collection('pins').where('status', 'in', ['Resolved', 'Solved']).get()
            .then(snapshot => {
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const timestamp = data.timestamp && data.timestamp.seconds ? data.timestamp.seconds * 1000 : new Date(data.timestamp).getTime();
                    if (timestamp && timestamp < thirtyDaysAgo) {
                        if (data.status === 'Solved' && data.type === 'landfill' && !data.emerging) {
                            doc.ref.delete().catch(error => console.error('Unable to delete old solved landfill report:', error));
                        } else if (data.status === 'Resolved') {
                            doc.ref.delete().catch(error => console.error('Unable to delete old resolved report:', error));
                        }
                    }
                });
            })
            .catch(error => console.error('Error cleaning old resolved reports:', error));
    }

    function ensureReportCoordinates() {
        if ((!currentReport || !currentReport.latitude || !currentReport.longitude) && userLocation) {
            if (currentReport) {
                setReportLocation(userLocation.lat, userLocation.lng, 'default');
            }
        }
    }

    function closeSuccessSheet() {
        document.getElementById('reportSuccessSheet').classList.add('hidden');
    }

    function gotoTrack() {
        window.location.href = 'Track.html';
    }

    function selectCategory(category, button) {
        const preservedImageUrl = currentReport?.imageUrl || null;
        const preservedLatitude = currentReport?.latitude || null;
        const preservedLongitude = currentReport?.longitude || null;
        const preservedLocationSource = currentReport?.locationSource || null;

        currentReport = {
            type: category === 'Illegal Landfill' ? 'landfill' : 'dumpster',
            label: category,
            description: '',
            urgent: false,
            imageUrl: preservedImageUrl,
            latitude: preservedLatitude,
            longitude: preservedLongitude,
            locationSource: preservedLocationSource,
            reporterId
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
        document.getElementById('sheetTitle').textContent = window.i18n?.t('reportDetails') || 'Report details';
        document.getElementById('sheetSubTitle').textContent = window.i18n?.t('reportRequestLocation') || 'Tap the map to place the pin and add details.';
        if (userLocation && !currentReport.latitude && !currentReport.longitude) {
            setReportLocation(userLocation.lat, userLocation.lng, 'default');
        }
    }

    function createPinIcon(pinData) {
        const iconUrl = pinData.type === 'landfill' ? 'pin-landfill.svg' : 'pin-dumpster.svg';
        return L.icon({
            iconUrl,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -38],
            className: 'custom-pin-icon'
        });
    }

    async function confirmReport() {
        if (!currentReport) {
            alert('Please choose a report type first.');
            return;
        }

        const descriptionId = currentReport.type === 'landfill' ? 'reportDescriptionL' : 'reportDescriptionD';
        const checkboxId = currentReport.type === 'landfill' ? 'reportFullCheckboxL' : 'reportFullCheckboxD';
        const imageId = currentReport.type === 'landfill' ? 'reportImageL' : 'reportImageD';

        const description = document.getElementById(descriptionId).value.trim();
        const urgent = document.getElementById(checkboxId).checked;
        const imageFile = document.getElementById(imageId)?.files?.[0] || null;

        if (!description) {
            alert(window.i18n?.t('describeLocation') || 'Please add a short description or location.');
            return;
        }

        if (!currentReport.latitude || !currentReport.longitude) {
            const gpsCoords = await getGpsFromFile(imageFile);
            if (gpsCoords) {
                setReportLocation(gpsCoords.lat, gpsCoords.lng);
            } else {
                ensureReportCoordinates();
            }
        }

        if (!currentReport.latitude || !currentReport.longitude) {
            alert(window.i18n?.t('reportLocationHint') || 'Tap the map to place the report pin.');
            return;
        }

        let imageUrl = currentReport.imageUrl || null;
        if (imageFile && !imageUrl) {
            imageUrl = await readFileAsDataURL(imageFile);
            currentReport.imageUrl = imageUrl;
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
            reporterId,
            emerging: false,
            full: currentReport.type === 'dumpster' ? true : null,
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
        const latitude = pinData.latitude || pinData.location?.lat;
        const longitude = pinData.longitude || pinData.location?.lng;

        if (!latitude || !longitude) {
            console.warn('Pin missing coordinates:', pinData);
            return;
        }

        const marker = L.marker([latitude, longitude], {
            icon: createPinIcon(pinData)
        }).addTo(map);

        const popupParts = [`<strong>${pinData.title}</strong>`, `<p>${pinData.description}</p>`];
        if (pinData.imageUrl) {
            popupParts.push(`<img src="${pinData.imageUrl}" style="width:180px;border-radius:14px;margin-top:8px;" />`);
        }
        if (pinData.urgent && pinData.type === 'landfill') {
            popupParts.push(`<em style="color:#d32f2f;">Urgent</em>`);
        }
        if (pinData.type === 'dumpster' && pinData.status === 'Solved' && !pinData.full) {
            popupParts.push(`<button onclick="markDumpsterFull('${id}')">Mark as Full</button>`);
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
    window.handleReportImageInput = handleReportImageInput;
    window.markDumpsterFull = async function(id) {
        await window.db.collection('pins').doc(id).update({ full: true, status: 'Reported' });
        // Optionally refresh map or something
    };

    // Rotating info
    const infoTips = [
        "Dispose of old furniture at the recycling center on Saturdays.",
        "Electronic waste collection every first Sunday of the month.",
        "Upcoming event: Clean Skopje Day on May 15th.",
        "Learn more about waste sorting at our workshops."
    ];
    let currentTipIndex = 0;
    const rotatingInfoEl = document.getElementById('rotating-info');
    if (rotatingInfoEl) {
        setInterval(() => {
            rotatingInfoEl.textContent = infoTips[currentTipIndex];
            currentTipIndex = (currentTipIndex + 1) % infoTips.length;
        }, 5000);
        rotatingInfoEl.textContent = infoTips[0];
    }

    const reportButton = document.getElementById('reportBtn');
    if (reportButton) {
        reportButton.addEventListener('click', openSheet);
    }

    cleanupOldResolvedReports();
    requestUserLocation();
    if (window.i18n) {
        window.i18n.translateDocument();
    }

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
            document.getElementById(labelId).textContent = `${window.i18n?.t('locationSet') || 'Location set:'} ${e.latlng.lat.toFixed(5)}, ${e.latlng.lng.toFixed(5)}`;
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

