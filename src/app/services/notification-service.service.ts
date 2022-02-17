import { Injectable } from '@angular/core';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

import { AngularFirestore } from '@angular/fire/firestore';
import { DataRepositoryService } from './data-repository.service';
import * as firebase from 'firebase';
import { LogService } from './log-service.service';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  token: Token = { value: '' };

  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private afs: AngularFirestore,
    private drs: DataRepositoryService,
    private logger: LogService
  ) {
    if (Capacitor.isNativePlatform()) {
      this.registerPushListeners();
    }
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
    if (data.role === 'cancel') {
      return undefined;
    }
    return data.data.values.newEmail;
  }

  async requestPushPermission() {
    if (!Capacitor.isNativePlatform()) return;
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
    if (!Capacitor.isNativePlatform()) return;
    const ref = this.afs.collection('fbm_push_tokens').doc(uid);
    ref
      .get()
      .toPromise()
      .then((old) => {
        if (old.exists && this.token) {
          ref.update({
            tokens: firebase.default.firestore.FieldValue.arrayUnion(this.token.value),
          });
        } else {
          if (this.token) {
            ref.set({
              tokens: [this.token.value],
            });
          }
        }
      });

    try {
      PushNotifications.register();
    } catch (err) {
      this.logger.warn('[ 🔔 PUSH NOTIFICATIONS ] Error registering:', err);
    }
  }
  registerPushListeners() {
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', async (token: Token) => {
      this.logger.info(
        '[ 🔔 PUSH NOTIFICATIONS ] Push registration success, token: ' + token.value
      );
      // Send the token to your server so it can use it to send push notifications to this device
      this.token = token;
    });

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', (error: any) => {
      this.logger.warn('[ 🔔 PUSH NOTIFICATIONS ] Error on registration: ' + JSON.stringify(error));
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
}
