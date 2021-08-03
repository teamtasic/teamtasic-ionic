import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    public authService: AuthService,
    public fb: FormBuilder
  ) { }

  loginForm: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'logging in...',
    });
    await loading.present();
    await this.authService.login(this.email.value, this.password.value);
    this.loadingController.dismiss();
    await loading.onDidDismiss();
    this.modalController.dismiss();
  }
  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
