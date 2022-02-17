import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { SplashScreen } from '@capacitor/splash-screen';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    public router: Router,
    public loadingController: LoadingController,
    public authService: AuthService,
    public fb: FormBuilder
  ) {
    SplashScreen.hide();
  }

  loginform: FormGroup = this.fb.group({});

  ngOnInit() {
    this.loginform = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'logging in...',
    });
    await loading.present();
    const { email, password } = this.loginform.value;
    this.loginform = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    await this.authService.login(email, password);

    this.loadingController.dismiss();
    await loading.onDidDismiss();
  }

  signUp() {
    this.router.navigateByUrl('/signup');
  }

  resetPW() {
    this.router.navigateByUrl('/reset');
  }

  get email() {
    return this.loginform.get('email');
  }
  get password() {
    return this.loginform.get('password');
  }
}
