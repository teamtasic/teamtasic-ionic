import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-loginmodal',
  templateUrl: './loginmodal.page.html',
  styleUrls: ['./loginmodal.page.scss'],
})
export class LoginmodalPage implements OnInit {
  constructor(
    private router: Router,
    public modalController: ModalController,
    public loadingController: LoadingController,
    public authService: AuthService
  ) {}

  ngOnInit() {}

  async login() {
    const loading = await this.loadingController.create({
      message: 'logging in...',
    });
    await loading.present();
    await this.authService.login('', '');
    this.loadingController.dismiss();
    await loading.onDidDismiss();
    this.router.navigate(['/tabs']);
    this.modalController.dismiss();
  }
}
