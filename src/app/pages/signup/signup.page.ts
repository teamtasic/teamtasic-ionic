import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LogService } from 'src/app/services/log-service.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private route: ActivatedRoute,
    private logger: LogService
  ) {}

  signupform: FormGroup = this.fb.group({});

  joinCode: string = '';

  ngOnInit() {
    this.signupform = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      surname: ['', [Validators.required, Validators.minLength(3)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      // tos
      tos: [false, [Validators.requiredTrue]],
      phoneNumber: ['', Validators.required],
      address: ['', Validators.required],
      zipcode: ['', Validators.required],
    });

    this.route.queryParams.subscribe((params) => {
      this.joinCode = params.code;
    });
  }

  async signUp() {
    await this.auth.createUser(
      this.email?.value,
      this.password?.value,
      `${this.surname?.value} ${this.name?.value}`,
      this.phoneNumber?.value,
      this.address?.value,
      this.zipcode?.value,
      this.joinCode
    );
  }

  get email() {
    return this.signupform.get('email');
  }
  get password() {
    return this.signupform.get('password');
  }
  get name() {
    return this.signupform.get('name');
  }
  get phoneNumber() {
    return this.signupform.get('phoneNumber');
  }
  get address() {
    return this.signupform.get('address');
  }
  get zipcode() {
    return this.signupform.get('zipcode');
  }
  get surname() {
    return this.signupform.get('surname');
  }
}
