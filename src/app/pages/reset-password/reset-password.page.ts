import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetPasswordForm: FormGroup = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
  });

  constructor(
    private fb: FormBuilder,
    public alertController: AlertController,
    public router: Router,
    public auth: AuthService
  ) {}

  async resetPassword() {
    await this.auth.resetPassword(this.email?.value);
    this.resetPasswordForm.reset();
    this.alertController
      .create({
        header: 'Überprüfe deine Mails',
        message: 'Du solltest in kürze eine Email von uns bekommen.',
        buttons: [
          {
            text: 'Zum login',
            handler: () => {
              this.router.navigateByUrl('/login');
            },
          },
        ],
      })
      .then((alert) => alert.present());
  }
  get email() {
    return this.resetPasswordForm.get('email');
  }

  ngOnInit() {}
}
