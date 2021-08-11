import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-club-create',
  templateUrl: './club-create.page.html',
  styleUrls: ['./club-create.page.scss'],
})
export class ClubCreatePage implements OnInit {
  clubCreateForm: FormGroup;
  licenseTier: string;
  constructor(public fb: FormBuilder) {}

  ngOnInit() {
    this.clubCreateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    });
  }
}
