import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  favoritePlaces: string[] = [];
  newPlace: string = '';

  constructor(private storage: Storage, private navCtrl: NavController) {
    this.init();
  }

  async init() {
    await this.storage.create(); // Inicializa o armazenamento
    this.loadPlaces();
  }

  async loadPlaces() {
    const storedPlaces = await this.storage.get('favoritePlaces');
    if (storedPlaces) {
      this.favoritePlaces = storedPlaces;
    }
  }

  async addPlace() {
    if (this.newPlace && !this.favoritePlaces.includes(this.newPlace)) {
      this.favoritePlaces.push(this.newPlace);
      await this.storage.set('favoritePlaces', this.favoritePlaces);
      this.newPlace = '';
    }
  }

  async removePlace(place: string) {
    this.favoritePlaces = this.favoritePlaces.filter(p => p !== place);
    await this.storage.set('favoritePlaces', this.favoritePlaces);
  }

  goToWeather(place: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        city: place
      }
    };
    this.navCtrl.navigateForward('/tabs/tab1', navigationExtras);
  }
}
