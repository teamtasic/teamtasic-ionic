import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { Clipboard } from '@capacitor/clipboard';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {
  constructor(public drs: DataRepositoryService, public fb: FormBuilder) {}

  userData: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
  });

  ngOnInit() {}

  async copyUidToClipboard() {
    await Clipboard.write({ string: this.drs.currentUser.getValue().uid });
    try {
      await Share.share({
        title: 'Meine Teamtasic User Id, füge mich deinem Team hinzu!',
        text: `Füge mich deinem Team hinzu, meine Teamtasic User Id ist ${
          this.drs.currentUser.getValue().uid
        }`,
        dialogTitle: 'Teile deine User Id mit deinem Administrator.',
      });
    } catch (error) {
      console.warn(error);
    }
  }
}
