import { BaseApiClient, ApiResponse } from './BaseApiClient';

export interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  description: string;
  icon: string;
  pressure: number;
  visibility: number;
  uvIndex: number;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  day: string;
  high: number;
  low: number;
  description: string;
  icon: string;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

export interface WeatherSearchParams {
  location: string;
  units?: 'metric' | 'imperial';
  lang?: string;
}

export class WeatherClient extends BaseApiClient {
  constructor(apiKey: string) {
    super('https://api.openweathermap.org/data/2.5', apiKey, 'weather');
  }

  async getCurrentWeather(params: WeatherSearchParams): Promise<ApiResponse<WeatherData>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockCurrentWeather(params));
    }

    const queryParams = new URLSearchParams({
      q: params.location,
      appid: this.apiKey,
      units: params.units || 'metric',
      lang: params.lang || 'en',
    });

    return this.get<WeatherData>(`/weather?${queryParams}`);
  }

  async getWeatherForecast(params: WeatherSearchParams): Promise<ApiResponse<WeatherData>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockWeatherForecast(params));
    }

    const queryParams = new URLSearchParams({
      q: params.location,
      appid: this.apiKey,
      units: params.units || 'metric',
      lang: params.lang || 'en',
      cnt: '7', // 7-day forecast
    });

    return this.get<WeatherData>(`/forecast?${queryParams}`);
  }

  async getWeatherByCoordinates(lat: number, lon: number, units: string = 'metric'): Promise<ApiResponse<WeatherData>> {
    if (!this.validateApiKey()) {
      return this.getMockData(this.getMockWeatherByCoordinates(lat, lon));
    }

    const queryParams = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      appid: this.apiKey,
      units,
    });

    return this.get<WeatherData>(`/weather?${queryParams}`);
  }

  // Mock data methods
  private getMockCurrentWeather(params: WeatherSearchParams): WeatherData {
    return {
      location: params.location,
      temperature: 22,
      feelsLike: 24,
      humidity: 65,
      windSpeed: 12,
      windDirection: 'NE',
      description: 'Partly cloudy',
      icon: '02d',
      pressure: 1013,
      visibility: 10000,
      uvIndex: 5,
      forecast: this.getMockForecast(),
    };
  }

  private getMockWeatherForecast(params: WeatherSearchParams): WeatherData {
    return {
      location: params.location,
      temperature: 22,
      feelsLike: 24,
      humidity: 65,
      windSpeed: 12,
      windDirection: 'NE',
      description: 'Partly cloudy',
      icon: '02d',
      pressure: 1013,
      visibility: 10000,
      uvIndex: 5,
      forecast: this.getMockForecast(),
    };
  }

  private getMockWeatherByCoordinates(lat: number, lon: number): WeatherData {
    return {
      location: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
      temperature: 20,
      feelsLike: 22,
      humidity: 70,
      windSpeed: 15,
      windDirection: 'SW',
      description: 'Sunny',
      icon: '01d',
      pressure: 1015,
      visibility: 10000,
      uvIndex: 7,
      forecast: this.getMockForecast(),
    };
  }

  private getMockForecast(): WeatherForecast[] {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      return {
        date: date.toISOString().split('T')[0] || '',
        day: days[date.getDay()] || '',
        high: 20 + Math.floor(Math.random() * 10),
        low: 10 + Math.floor(Math.random() * 10),
        description: ['Sunny', 'Partly cloudy', 'Cloudy', 'Light rain', 'Clear'][Math.floor(Math.random() * 5)] || 'Clear',
        icon: ['01d', '02d', '03d', '10d', '01n'][Math.floor(Math.random() * 5)] || '01d',
        precipitation: Math.floor(Math.random() * 5),
        humidity: 60 + Math.floor(Math.random() * 30),
        windSpeed: 5 + Math.floor(Math.random() * 15),
      };
    });
  }
}
