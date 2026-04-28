

class AirQualityAPIManager {
  constructor() {
    this.apiToken = '920a3bd0416aa65f6fde1957372621a3a4013597'; // AQICN API token
    this.apiBase = 'https://aqicn.org/api/';
  }

  async fetchWAQIStations(bounds) {
    const url = `${this.apiBase}map/bounds?latlng=${bounds}&token=${this.apiToken}`;
    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json.status === 'ok') {
        return json.data.map(station => ({
          source: 'WAQI',
          uid: station.uid,
          lat: station.lat,
          lng: station.lon,
          station: station.station,
          aqi: station.aqi,
          type: 'public'
        }));
      }
    } catch (error) {
      console.error('WAQI API Error:', error);
    }
    return [];
  }

  
  
 
  async fetchCityManagedStations(bounds) {
    
    const cityApiUrl = '/api/city-stations'; 
    try {
      const response = await fetch(`${cityApiUrl}?bounds=${bounds}`);
      const json = await response.json();
      if (json && Array.isArray(json)) {
        return json.map(station => ({
          source: 'City',
          uid: station.id,
          lat: station.latitude,
          lng: station.longitude,
          station: station.name,
          aqi: station.aqi || this.calculateAQIFromPollutants(station.components),
          type: 'cityManaged',
          components: station.components
        }));
      }
    } catch (error) {
      console.error('City API Error:', error);
    }
    return [];
  }

  
  async fetchAllStations(bounds) {
    const sources = window.i18n.aqiSources;
    const allStations = [];

    if (sources.public) {
      const waqiStations = await this.fetchWAQIStations(bounds);
      allStations.push(...waqiStations);
    }

    if (sources.private) {
      const owStations = await this.fetchOpenWeatherStations(bounds);
      allStations.push(...owStations);
    }

    if (sources.cityManaged) {
      const cityStations = await this.fetchCityManagedStations(bounds);
      allStations.push(...cityStations);
    }

    return allStations;
  }

  
  async getStationDetails(uid, source = 'WAQI') {
    if (source === 'WAQI') {
      const url = `${this.apiBase}feed/@${uid}/?token=${this.apiToken}`;
      try {
        const response = await fetch(url);
        return await response.json();
      } catch (error) {
        console.error('WAQI Detail Error:', error);
      }
    }
    return null;
  }

  calculateAQIFromPollutants(components) {
    let aqi = 50;

    if (components.pm25) {
      if (components.pm25 <= 12) aqi = components.pm25 * 4.17;
      else if (components.pm25 <= 35) aqi = 50 + (components.pm25 - 12) * 2.38;
      else if (components.pm25 <= 55) aqi = 100 + (components.pm25 - 35) * 2.5;
      else aqi = 200;
    }

    return Math.round(aqi);
  }

  getAqiStatus(aqi) {
    if (aqi <= 50) return window.i18n.t('good');
    if (aqi <= 100) return window.i18n.t('moderate');
    if (aqi <= 150) return window.i18n.t('unhealthySensitive');
    if (aqi <= 200) return window.i18n.t('unhealthy');
    if (aqi <= 300) return window.i18n.t('veryUnhealthy');
    return window.i18n.t('hazardous');
  }

  getAqiColor(aqi) {
    if (aqi <= 50) return '#4caf50'; // Green - Good
    if (aqi <= 100) return '#ffeb3b'; // Yellow - Moderate
    if (aqi <= 150) return '#ff9800'; // Orange - Unhealthy for Sensitive
    if (aqi <= 200) return '#f44336'; // Red - Unhealthy
    if (aqi <= 300) return '#9c27b0'; // Purple - Very Unhealthy
    return '#4a148c'; // Dark Purple - Hazardous
  }
}


window.aqiManager = new AirQualityAPIManager();
