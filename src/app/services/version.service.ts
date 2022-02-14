import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { ModalController } from '@ionic/angular';
import { UpgradePromptComponent } from '../components/upgrade-prompt/upgrade-prompt.component';

@Injectable({
  providedIn: 'root',
})
export class VersionService {
  static version = '260';

  constructor(private afs: AngularFirestore, private modalController: ModalController) {
    this.afs
      .collection('versions')
      .doc(VersionService.version)
      .get()
      .toPromise()
      .then(async (doc: any) => {
        var showDeprecated = false;
        console.log('version', doc);
        if (!doc.exists) {
          showDeprecated = true;
        } else {
          var version = doc.data();
          if (version.deprecated) {
            showDeprecated = true;
          }
        }
        if (showDeprecated) {
          const modal = await modalController.create({
            component: UpgradePromptComponent,
            swipeToClose: false,
          });
          await modal.present();
        }
      });
  }
}
