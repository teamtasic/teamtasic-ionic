import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Club } from 'src/app/classes/club';
import { DataRepositoryService } from 'src/app/services/data-repository.service';

@Component({
  selector: 'app-club-create',
  templateUrl: './club-create.page.html',
  styleUrls: ['./club-create.page.scss'],
})
export class ClubCreatePage implements OnInit {
  clubCreateForm: FormGroup;
  licenseTier: string = 'standard';

  constructor(public fb: FormBuilder, private drs: DataRepositoryService, private router: Router) {}

  ngOnInit() {
    this.clubCreateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      tos: [false, [Validators.requiredTrue]],
      tier: ['standard', [Validators.required]],
    });
  }

  async createClub() {
    console.log(this.clubCreateForm.value);

    await this.drs.createClub(
      new Club('', null, this.clubCreateForm.value.name, ''),
      this.licenseNumber
    );
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await this.drs.resync();
    this.router.navigate(['/my-clubs']);
  }

  get name() {
    return this.clubCreateForm.get('name');
  }
  get license() {
    return this.clubCreateForm.get('tier');
  }
  get licenseNumber() {
    const _: Map<string, number> = new Map<string, number>([
      ['bare', 0],
      ['standard', 1],
      ['nolimit', 2],
    ]);
    return _.get(this.license.value);
  }
}
