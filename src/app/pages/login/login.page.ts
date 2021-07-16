import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { LoginmodalPage } from './loginmodal/loginmodal.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(public modalController: ModalController, public router: Router) {}

  ngOnInit() {}

  async presentLoginModal() {
    const modal = await this.modalController.create({
      component: LoginmodalPage,
      swipeToClose: true,
    });
    return await modal.present();
  }
  signUp() {
    this.router.navigateByUrl('/signup');
  }

  resetPW() {
    this.router.navigateByUrl('/reset');
  }
}
