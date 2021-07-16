import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  constructor(
    /*private formBuilder: FormBuilder,*/ private auth: AuthService
  ) {}

  //signupform: FormGroup = new FormGroup({});

  ngOnInit() {
    // this.signupform = this.formBuilder.group({
    //   Displayname: ['', [Validators.required]],
    //   Email: ['', [Validators.email, Validators.required]],
    //   Password: [
    //     '',
    //     [
    //       Validators.required,
    //       Validators.minLength(6),
    //       Validators.maxLength(24),
    //     ],
    //   ],
    // });
  }
  signUp() {}
}
