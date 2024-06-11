import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  weatherData: any;
  forecastData: any;
  searchCity: string = '';
  windDirection: string = '';
  userData$!: Observable<any>;

  constructor(private http: HttpClient, private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.userData$ = this.authService.getUserData();
    this.route.queryParams.subscribe(params => {
      if (params['city']) {
        this.searchCity = params['city'];
        this.searchWeather();
      }
    });
  }

  searchWeather() {
    console.log('Procurando clima para', this.searchCity);
    if (!this.searchCity) {
      return;
    }

    const apiKey = 'b44d570a8769007984fe5a5c92c3e9c6';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${this.searchCity}&appid=${apiKey}&units=metric`;

    this.http.get(apiUrl).subscribe(
      data => {
        this.weatherData = data;
        this.weatherData.wind.speed = this.convertMpsToKmh(this.weatherData.wind.speed);
        this.windDirection = this.getWindDirection(this.weatherData.wind.deg);
        this.searchCity = '';
        this.getForecast();
      },
      error => {
        console.error('Erro ao buscar dados do clima:', error);
      }
    );
  }

  getForecast() {
    const apiKey = 'b44d570a8769007984fe5a5c92c3e9c6';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${this.weatherData.name}&appid=${apiKey}&units=metric`;

    this.http.get(apiUrl).subscribe(
      data => {
        this.forecastData = data;
      },
      error => {
        console.error('Erro ao buscar dados da previsão:', error);
      }
    );
  }

  getWeatherIcon(iconCode: string) {
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  }

  getWindDirection(deg: number): string {
    if (deg > 337.5 || deg <= 22.5) return 'Norte';
    if (deg > 22.5 && deg <= 67.5) return 'Nordeste';
    if (deg > 67.5 && deg <= 112.5) return 'Leste';
    if (deg > 112.5 && deg <= 157.5) return 'Sudeste';
    if (deg > 157.5 && deg <= 202.5) return 'Sul';
    if (deg > 202.5 && deg <= 247.5) return 'Sudoeste';
    if (deg > 247.5 && deg <= 292.5) return 'Oeste';
    return 'Noroeste';
  }

  convertMpsToKmh(mps: number): number {
    return mps * 3.6;
  }

  isGoodWeatherForFlying() {
    if (!this.weatherData) return false;
    const windSpeed = this.weatherData.wind.speed;
    return windSpeed <= 20;
  }

  getFlightStatus() {
    return this.isGoodWeatherForFlying() ? 'Tempo bom para voo' : 'Tempo ruim para voo';
  }

  translateWeatherDescription(description: string): string {
    const descriptions: { [key: string]: string } = {
      'clear sky': 'Céu limpo',
      'few clouds': 'Poucas nuvens',
      'scattered clouds': 'Nuvens dispersas',
      'broken clouds': 'Nuvens quebradas',
      'overcast clouds': 'Tempo nublado',
      'shower rain': 'Pancadas de chuva',
      'rain': 'Chuva',
      'thunderstorm': 'Trovoada',
      'snow': 'Neve',
      'mist': 'Névoa'
    };
    return descriptions[description.toLowerCase()] || description;
  }

  getDayOfWeek(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  }

  uniqueForecastDays(forecastList: any[]) {
    const daysSeen = new Set<string>();
    return forecastList.filter(forecast => {
      const day = this.getDayOfWeek(forecast.dt);
      if (daysSeen.has(day)) {
        return false;
      } else {
        daysSeen.add(day);
        return true;
      }
    }).slice(0, 7);
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigateByUrl('/login');
    });
  }
}
