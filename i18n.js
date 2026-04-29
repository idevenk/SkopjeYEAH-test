// i18n.js - Internationalization and localization support

const translations = {
  en: {
    // Navigation
    home: 'Home',
    airQuality: 'Air Quality',
    track: 'Track',
    settings: 'Settings',
    
    // Home/Index
    createNewReport: 'Create New Report',
    chooseReportType: 'Choose a report type',
    reportNew: 'REPORT NEW',
    
    // Report Types
    illegalLandfill: 'Illegal Landfill',
    reportIllegalWaste: 'Report illegal waste disposal',
    fullContainer: 'Mark Dumpster',
    flagDumpsters: 'Flag (overflowing) public dumpsters',
    
    // Report Form
    reportDetails: 'Report details',
    tapMapToPlace: 'Tap the map to place the pin and add details.',
    selectReportType: 'Select a report type',
    describeLocation: 'Describe the location or issue',
    nearSchool: 'Near School',
    nearRiver: 'Near River',
    earlyStage: 'Early Stage',
    large: 'Large',
    severity: 'severity',
    urgent: 'Urgent',
    addPhoto: 'Add photo',
    tapMapToChoose: 'Tap the map to choose the report location.',
    submit: 'Submit',
    markAsFull: 'Mark as full',
    
    // Success
    reportSubmitted: 'Report Submitted',
    successSentToCity: 'Successfully sent to the city team.',
    trackProgress: 'Track Progress',
    
    // Air Quality
    tapMarkerToShow: 'Tap a marker to show air quality',
    selectLocationView: 'Select a location on the map to view AQI, PM2.5, PM10 and status details.',
    loadingNearby: 'Loading nearby AQI stations...',
    fetchingLive: 'Fetching live AQI details for',
    unavailable: 'Air quality details are unavailable.',
    couldNotLoad: 'Could not load air quality details.',
    good: 'Good',
    moderate: 'Moderate',
    poor: 'Poor',
    unhealthySensitive: 'Unhealthy for Sensitive Groups',
    unhealthy: 'Unhealthy',
    veryUnhealthy: 'Very Unhealthy',
    hazardous: 'Hazardous',
    dominentPollutant: 'Dominant pollutant',
    source: 'Source',
    updated: 'Updated',
    aqPopupTitle: 'Air Quality Details',
    findMyLocation: 'Find My Location',
    
    // Track
    trackReports: 'Track Reports',
    seeAllCommunity: 'See all community reports and follow their progress.',
    noReports: 'No reports yet.',
    reported: 'Reported',
    
    // Settings
    officialSignIn: 'Official Sign In',
    enterAccessCode: 'Enter the official access code to manage report statuses.',
    officialCode: 'Official code',
    signIn: 'Sign In',
    manageReports: 'Manage Reports',
    updateStatus: 'Update status for submitted reports.',
    signedInAsOfficial: 'Signed in as official. You can manage report statuses.',
    codeIncorrect: 'Access code is incorrect.',
    
    // Settings - New Features
    language: 'Language',
    selectLanguage: 'Select your preferred language',
    english: 'English',
    macedonian: 'Македонски',
    albanian: 'Shqip',
    
    textSize: 'Text Size',
    selectTextSize: 'Adjust text size for better readability',
    small: 'Small',
    normal: 'Normal',
    large: 'Large',
    extraLarge: 'Extra Large',
    
    pinTypes: 'Pin Types to Display',
    togglePinVisibility: 'Toggle which report types appear on the map',
    landfill: 'Landfills',
    dumpster: 'Dumpsters',
    
    airQualitySources: 'Air Quality Data Sources',
    selectDataSources: 'Choose which station types to display',
    publicStations: 'Public Stations',
    privateStations: 'Private Stations',
    cityManagedStations: 'City Managed Stations',
    
    selected: 'selected',
    heroTitle: 'Alert Us For a Cleaner Skopje',
    heroSubtitle: 'Real Time Air, Waste & Landfill Monitoring',
    reportTypeIllegalLandfill: 'Illegal Landfill',
    reportTypeFullContainer: 'Mark Dumpster',
    reportCaptionLandfill: 'Report illegal waste disposal',
    reportCaptionDumpster: 'Flag (overflowing) public dumpsters',
    reportFormTitle: 'Report details',
    reportSelectLabel: 'Select a report type',
    reportSubmit: 'Submit',
    reportLocationHint: 'Tap the map to choose the report location.',
    reportRequestLocation: 'Tap the map to place the report pin.',
    setSeverity: 'Set Severity',
    reportSubmittedSuccess: 'Report Submitted Successfully!',
    reportTrackNow: 'Track Now',
    locationSet: 'Location set:',
    loadingReports: 'Loading reports...',
    unableToLoadReports: 'Unable to load reports.',
    appRequiredTitle: 'SkopjeYEAH App Required',
    appRequiredText: 'This map and air quality data are only available in the official app.',
    // Status labels
    status: 'Status',
    inProgress: 'In Progress',
    resolved: 'Resolved',
  },
  
  mk: {
    // Navigation
    home: 'Дом',
    airQuality: 'Квалитет на воздух',
    track: 'Следи',
    settings: 'Поставки',
    
    // Home/Index
    createNewReport: 'Креирај нова пријава',
    chooseReportType: 'Одбери тип на пријава',
    reportNew: 'ПРИЈАВИ НОВО',
    
    // Report Types
    illegalLandfill: 'Илегална депонија',
    reportIllegalWaste: 'Пријави илегално отпадување на отпад',
    fullContainer: 'Означи контејнер',
    flagDumpsters: 'Означи полни јавни контејнери',
    
    // Report Form
    reportDetails: 'Детали на пријава',
    tapMapToPlace: 'Кликни на мапата за да го постави пинот и додај детали.',
    selectReportType: 'Одбери тип на пријава',
    describeLocation: 'Опиши локација или проблем',
    nearSchool: 'Блиску до школа',
    nearRiver: 'Блиску до река',
    earlyStage: 'Почетна фаза',
    large: 'Големо',
    severity: 'тежина',
    urgent: 'Итно',
    addPhoto: 'Додај фотографија',
    tapMapToChoose: 'Кликни на мапата за да ја одбереш локацијата на пријавата.',
    submit: 'Поднеси',
    markAsFull: 'Означи како полна',
    reportLocationHint: 'Кликни на мапата за да ја одбереш локацијата на пријавата.',
    reportRequestLocation: 'Кликни на мапата за да го поставиш пинот и да додадеш детали.',
    setSeverity: 'Постави тежина',
    reportSubmittedSuccess: 'Пријавата е успешно поднесена!',
    reportTrackNow: 'Следи сега',
    
    // Success
    reportSubmitted: 'Пријава поднесена',
    successSentToCity: 'Успешно послана на градскиот тим.',
    trackProgress: 'Следи напредок',
    
    // Air Quality
    tapMarkerToShow: 'Кликни на маркер за да ги видиш детали за квалитет на воздух',
    selectLocationView: 'Одбери локација на мап за да ги видиш AQI, PM2.5, PM10 и статус детали.',
    loadingNearby: 'Вчитување на блиски AQI станици...',
    fetchingLive: 'Преземање на живи AQI детали за',
    unavailable: 'Детали за квалитет на воздух се недостапни.',
    couldNotLoad: 'Не можеше да се вчитаат детали за квалитет на воздух.',
    good: 'Добро',
    moderate: 'Умерено',
    poor: 'Лошо',
    unhealthySensitive: 'Нездраво за осетливи групи',
    unhealthy: 'Нездраво',
    veryUnhealthy: 'Многу нездраво',
    hazardous: 'Опасно',
    dominentPollutant: 'Доминантен загадувач',
    source: 'Извор',
    updated: 'Ажурирано',
    aqPopupTitle: 'Детали за квалитетот на воздухот',
    findMyLocation: 'Најди моја локација',
    
    // Track
    trackReports: 'Следи пријави',
    seeAllCommunity: 'Видете ги сите пријави од заедницата и следете го нивниот напредок.',
    noReports: 'Нема пријави сеуште.',
    reported: 'Пријавено',
    
    // Settings
    officialSignIn: 'Официјална пријава',
    enterAccessCode: 'Внеси официјален код за пристап за управување со статусот на пријави.',
    officialCode: 'Официјален код',
    signIn: 'Пријави се',
    manageReports: 'Управување со пријави',
    updateStatus: 'Ажурирање статус за поднесени пријави.',
    signedInAsOfficial: 'Пријавен/а сте како официјален. Можете да управувате со статусот на пријави.',
    codeIncorrect: 'Кодот за пристап е неточен.',
    
    // Settings - New Features
    language: 'Јазик',
    selectLanguage: 'Одбери го твојот пожелан јазик',
    english: 'English',
    macedonian: 'Македонски',
    albanian: 'Shqip',
    
    textSize: 'Величина на текст',
    selectTextSize: 'Прилагодите величина на текстот за подобра читливост',
    small: 'Мало',
    normal: 'Нормално',
    large: 'Големо',
    extraLarge: 'Многу големо',
    
    pinTypes: 'Типови на пини за приказ',
    togglePinVisibility: 'Избери кои типови на пријави да се приказуваат на мапата',
    landfill: 'Депонии',
    dumpster: 'Контејнери',
    
    airQualitySources: 'Извори на податоци за квалитет на воздух',
    selectDataSources: 'Одбери кои типови на станици да се приказуваат',
    publicStations: 'Јавни станици',
    privateStations: 'Приватни станици',
    cityManagedStations: 'Градски управувани станици',
    
    locationSet: 'Локацијата е зададена:',
    loadingReports: 'Вчитување на пријави...',
    unableToLoadReports: 'Не можеа да се вчитаат пријавите.',
    appRequiredTitle: 'Потребна е апликација SkopjeYEAH',
    appRequiredText: 'Оваа мапа и податоци за квалитетот на воздухот се достапни само во официјалната апликација.',
    heroTitle: 'Известете за почист Скопје',
    heroSubtitle: 'Мониторинг во реално време на воздухот, отпадот и депониите',
    reportTypeIllegalLandfill: 'Илегална депонија',
    reportTypeFullContainer: 'Означи контејнер',
    reportCaptionLandfill: 'Пријави илегално отпадување на отпад',
    reportCaptionDumpster: 'Означи полн јавен контејнер',
    reportFormTitle: 'Детали за пријавата',
    reportSelectLabel: 'Одбери тип на пријава',
    reportSubmit: 'Поднеси',
    reportLocationHint: 'Кликни на мапата за да ја избереш локацијата на пријавата.',
    reportRequestLocation: 'Кликни на мапата за да го поставиш пинот и да додадеш детали.',
    setSeverity: 'Постави тежина',
    reportSubmittedSuccess: 'Пријавата е успешно поднесена!',
    reportTrackNow: 'Следи сега',
    // Status labels
    status: 'Статус',
    inProgress: 'Во тек',
    resolved: 'Решено',
  },
  
  sq: {
    // Navigation
    home: 'Shtëpi',
    airQuality: 'Cilësia e ajrit',
    track: 'Ndjekje',
    settings: 'Cilësimet',
    
    // Home/Index
    createNewReport: 'Krijo raport të ri',
    chooseReportType: 'Zgjidh një lloj raporti',
    reportNew: 'RAPORTO TË RËNE',
    
    // Report Types
    illegalLandfill: 'Deponije Ilegale',
    reportIllegalWaste: 'Raportoni hedhjen ilegale të mbeturinave',
    fullContainer: 'Shëno Kontejnerin',
    flagDumpsters: 'Shënoni kontejnerët e plotë publik',
    
    // Report Form
    reportDetails: 'Detajet e raportit',
    tapMapToPlace: 'Prekni hartën për të vendosur pin-in dhe shtoni detaje.',
    selectReportType: 'Zgjidh llojin e raportit',
    describeLocation: 'Përshkruajeni vendndodhjen ose problemin',
    nearSchool: 'Afër shkollës',
    nearRiver: 'Afër lumit',
    earlyStage: 'Faza e hershme',
    large: 'E madhe',
    severity: 'rëndësia',
    urgent: 'Urgjent',
    addPhoto: 'Shto foto',
    tapMapToChoose: 'Prekni hartën për të zgjedhur vendndodhjen e raportit.',
    submit: 'Dorëzo',
    markAsFull: 'Shëno si i plotë',
    
    // Success
    reportSubmitted: 'Raporti u dorëzua',
    successSentToCity: 'U dërgua me sukses te ekipi i qytetit.',
    trackProgress: 'Ndjek përparimin',
    
    // Air Quality
    tapMarkerToShow: 'Prekni shënuesin për të shfaqur cilësinë e ajrit',
    selectLocationView: 'Zgjidh një vendndodhje në hartë për të parë detajet e AQI, PM2.5, PM10 dhe statusit.',
    loadingNearby: 'Ngarkim i stacioneve të afërt AQI...',
    fetchingLive: 'Marrja e detajeve të drejtpërdrejta të AQI për',
    unavailable: 'Detajet e cilësisë së ajrit nuk janë të disponueshme.',
    couldNotLoad: 'Nuk mund të ngarkohen detajet e cilësisë së ajrit.',
    good: 'E mirë',
    moderate: 'Moderat',
    poor: 'E keqe',
    unhealthySensitive: 'E pashëndetshme për grupe të ndjeshme',
    unhealthy: 'E pashëndetshme',
    veryUnhealthy: 'Shumë e pashëndetshme',
    hazardous: 'E rrezikshme',
    dominentPollutant: 'Ndotësi dominues',
    source: 'Burimi',
    updated: 'Përditësuar',
    
    // Track
    trackReports: 'Ndjekje raportesh',
    seeAllCommunity: 'Shihni të gjitha raportet e komunitetit dhe ndjekni përparimin e tyre.',
    noReports: 'Nuk ka raporte ende.',
    reported: 'Raportuar',
    
    // Settings
    officialSignIn: 'Hyrje zyrtare',
    enterAccessCode: 'Futni kodin zyrtar të hyrjes për të menaxhuar statusin e raporteve.',
    officialCode: 'Kodi zyrtar',
    signIn: 'Hyj',
    manageReports: 'Menaxho raportet',
    updateStatus: 'Përditësoni statusin e raporteve të dorëzuara.',
    signedInAsOfficial: 'Jeni hyrë si zyrtar. Mund të menaxhoni statusin e raporteve.',
    codeIncorrect: 'Kodi i hyrjes është i pasaktë.',
    
    // Settings - New Features
    language: 'Gjuha',
    selectLanguage: 'Zgjidh gjuhën e preferuar',
    english: 'English',
    macedonian: 'Македонски',
    albanian: 'Shqip',
    
    textSize: 'Madhësia e tekstit',
    selectTextSize: 'Rregulloni madhësinë e tekstit për lexueshmëri më të mirë',
    small: 'E vogël',
    normal: 'Normale',
    large: 'E madhe',
    extraLarge: 'Shumë e madhe',
    
    pinTypes: 'Llojet e Pin-ave për ekran',
    togglePinVisibility: 'Zgjidhni cilat lloje raportesh shfaqen në hartë',
    landfill: 'Deponi',
    dumpster: 'Kontejnerë',
    
    airQualitySources: 'Burimet e të dhënave për cilësinë e ajrit',
    selectDataSources: 'Zgjidh cilat lloje stacionesh të shfaqen',
    publicStations: 'Stacione publike',
    privateStations: 'Stacione private',
    cityManagedStations: 'Stacione të menaxhuara nga qyteti',
    
    selected: 'i përzgjedhur',
    locationSet: 'Lokacioni është vendosur:',
    loadingReports: 'Duke ngarkuar raporte...',
    unableToLoadReports: 'Nuk mund të ngarkoheshin raportet.',
    appRequiredTitle: 'Kërkohet aplikacioni SkopjeYEAH',
    appRequiredText: 'Kjo hartë dhe të dhëna për cilësinë e ajrit janë në dispozicion vetëm në aplikacionin zyrtar.',
    heroTitle: 'Na informoni për një Shkup më të pastër',
    heroSubtitle: 'Monitorim në kohë reale të ajrit, mbeturinave dhe deponive',
    reportTypeIllegalLandfill: 'Deponije Ilegale',
    reportTypeFullContainer: 'Shëno Kontejnerin',
    reportCaptionLandfill: 'Raportoni hedhjen ilegale të mbeturinave',
    reportCaptionDumpster: 'Shënoni kontejnerët e plotë publik',
    reportFormTitle: 'Detajet e raportit',
    reportSelectLabel: 'Zgjidh llojin e raportit',
    reportSubmit: 'Dorëzo',
    reportLocationHint: 'Prekni hartën për të zgjedhur vendndodhjen e raportit.',
    reportRequestLocation: 'Prekni hartën për të vendosur pin-in dhe shtoni detaje.',
    setSeverity: 'Vendos intensitetin',
    reportSubmittedSuccess: 'Raporti u dorëzua me sukses!',
    reportTrackNow: 'Ndjek tani',
    aqPopupTitle: 'Detajet e cilësisë së ajrit',
    findMyLocation: 'Gjej vendndodhjen time',
    // Status labels
    status: 'Statusi',
    inProgress: 'Në vazhdim',
    resolved: 'Zgjidhur',
  }
};

// Settings Management
class I18nManager {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || 'en';
    this.currentFontSize = this.getStoredFontSize() || 'normal';
    this.pinVisibility = this.getStoredPinVisibility() || { landfill: true, dumpster: true };
    this.aqiSources = this.getStoredAqiSources() || { public: true, private: true, cityManaged: true };
    this.applySettings();
  }
  
  getStoredLanguage() {
    return localStorage.getItem('i18n_language');
  }
  
  setLanguage(lang) {
    if (translations[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('i18n_language', lang);
      this.applySettings();
      this.notifyListeners();
      return true;
    }
    return false;
  }
  
  getStoredFontSize() {
    return localStorage.getItem('i18n_fontSize');
  }
  
  setFontSize(size) {
    const validSizes = ['small', 'normal', 'large', 'extra-large'];
    if (validSizes.includes(size)) {
      this.currentFontSize = size;
      localStorage.setItem('i18n_fontSize', size);
      this.applySettings();
      this.notifyListeners();
      return true;
    }
    return false;
  }
  
  getStoredPinVisibility() {
    const stored = localStorage.getItem('pinVisibility');
    return stored ? JSON.parse(stored) : null;
  }
  
  setPinVisibility(visibility) {
    this.pinVisibility = visibility;
    localStorage.setItem('pinVisibility', JSON.stringify(visibility));
    this.notifyListeners();
  }
  
  getStoredAqiSources() {
    const stored = localStorage.getItem('aqiSources');
    return stored ? JSON.parse(stored) : null;
  }
  
  setAqiSources(sources) {
    this.aqiSources = sources;
    localStorage.setItem('aqiSources', JSON.stringify(sources));
    this.notifyListeners();
  }
  
  applySettings() {
    document.documentElement.lang = this.currentLanguage;
    
    const fontSizeMap = {
      'small': '14px',
      'normal': '16px',
      'large': '18px',
      'extra-large': '20px'
    };
    
    document.documentElement.style.setProperty('--base-font-size', fontSizeMap[this.currentFontSize]);
    const setBodyFont = () => {
      document.body.style.fontSize = fontSizeMap[this.currentFontSize];
    };
    if (document.body) {
      setBodyFont();
    } else {
      document.addEventListener('DOMContentLoaded', setBodyFont, { once: true });
    }
  }

  translateDocument(root = document) {
    root.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = this.t(el.dataset.i18n);
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.dataset.i18nPlaceholder);
    });
    root.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = this.t(el.dataset.i18nTitle);
    });
    root.querySelectorAll('[data-i18n-value]').forEach(el => {
      el.value = this.t(el.dataset.i18nValue);
    });
    root.querySelectorAll('[data-i18n-html]').forEach(el => {
      el.innerHTML = this.t(el.dataset.i18nHtml);
    });
  }

  t(key) {
    return translations[this.currentLanguage]?.[key] || translations['en']?.[key] || key;
  }
  
  notifyListeners() {
    window.dispatchEvent(new CustomEvent('i18nChanged', { 
      detail: { language: this.currentLanguage, fontSize: this.currentFontSize } 
    }));
  }
}

// Initialize global i18n manager
window.i18n = new I18nManager();
window.i18n.translateDocument();

window.changeLanguage = function(lang) {
  if (window.i18n.setLanguage(lang)) {
    window.i18n.translateDocument();
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }
};

window.changeFontSize = function(size) {
  if (window.i18n.setFontSize(size)) {
    document.querySelectorAll('[data-size]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.size === size);
    });
  }
};

window.translatePage = function(root = document) {
  window.i18n.translateDocument(root);
};

window.addEventListener('i18nChanged', () => {
  window.i18n.translateDocument();
});

document.addEventListener('DOMContentLoaded', () => {
  window.i18n.translateDocument();
});

window.addEventListener('load', () => {
  window.i18n.translateDocument();
});
