import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  resetPasswordForm: FormGroup = this.fb.group({
    email: ['', Validators.compose([Validators.required, Validators.email])],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {}
}
