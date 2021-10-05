import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastController: ToastController) {}

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      position: 'bottom',
      color: 'dark',
      duration: 2500,
    });
    await toast.present();
  }
}
