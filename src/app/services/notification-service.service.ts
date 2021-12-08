import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataRepositoryService } from './data-repository.service';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  token: Token = undefined;

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private afs: AngularFirestore,
    private drs: DataRepositoryService
  ) {
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', async (token: Token) => {
      console.log('[ 🔔 PUSH NOTIFICATIONS ] Push registration success, token: ' + token.value);
      // Send the token to your server so it can use it to send push notifications to this device
      this.token = token;
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      console.warn('[ 🔔 PUSH NOTIFICATIONS ] Error on registration: ' + JSON.stringify(error));
    });

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        // alert('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        // alert('Push action performed: ' + JSON.stringify(notification));
        // Open messages here
      }
    );
  }

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

  async requestPushPermission() {
    PushNotifications.requestPermissions().then((result) => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
        // this.showToast('Push Erlaubnis erteilt');
      } else {
        // this.showToast('Push Erlaubnis abgelehnt');
      }
    });
  }
  registerPushNotifications(uid: string) {
    const ref = this.afs.collection('fbm_push_tokens').doc(uid);
    ref
      .get()
      .toPromise()
      .then((old) => {
        if (old.exists) {
          ref.update({
            tokens: firebase.default.firestore.FieldValue.arrayUnion(this.token.value),
          });
        } else {
          ref.set({
            tokens: [this.token.value],
          });
        }
      });

    try {
      PushNotifications.register();
    } catch (err) {
      console.warn('[ 🔔 PUSH NOTIFICATIONS ] Error registering:', err);
    }
  }
}
