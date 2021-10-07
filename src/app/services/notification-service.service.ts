import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastController: ToastController, private alertController: AlertController) {}

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      position: 'bottom',
      color: 'dark',
      duration: 2500,
    });
    await toast.present();
  }
  async promptForNewEmail() {
    // prompt the user to enter a new email address using alert
    const alert = await this.alertController.create({
      header: 'Change Email',
      inputs: [
        {
          name: 'newEmail',
          type: 'email',
          placeholder: 'Your new email',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
            return undefined;
          },
        },
        {
          text: 'Ok',
          role: 'ok',
          handler: async (data) => {
            return data;
          },
        },
      ],
    });
    await alert.present();
    const data = await alert.onDidDismiss();
    console.log(data);
    if (data.role === 'cancel') {
      return undefined;
    }
    console.log(data.data.values.newEmail);
    return data.data.values.newEmail;
  }
}
