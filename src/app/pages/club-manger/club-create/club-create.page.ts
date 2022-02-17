import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Club } from 'src/app/classes/club';
import { DataRepositoryService } from 'src/app/services/data-repository.service';
import { LogicService } from 'src/app/services/logic.service';
import { NotificationService } from 'src/app/services/notification-service.service';

@Component({
  selector: 'app-club-create',
  templateUrl: './club-create.page.html',
  styleUrls: ['./club-create.page.scss'],
})
export class ClubCreatePage implements OnInit {
  clubCreateForm: FormGroup = this.fb.group({});
  licenseTier: string = 'free';

  constructor(
    public fb: FormBuilder,
    private drs: DataRepositoryService,
    private router: Router,
    private ns: NotificationService,
    public loadingController: LoadingController,
    public logic: LogicService
  ) {
    // if (!this.drs.currentUser) {
    //   this.router.navigate(['/login']);
    // }
  }

  ngOnInit() {
    this.clubCreateForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      tos: [false, [Validators.requiredTrue]],
      licenseKey: [
        '',
        [Validators.required, Validators.minLength(3), isValidLicenseKeyValidator()],
      ],
    });
  }

  async createClub() {
    const loading = await this.loadingController.create({
      message: 'Erstelle Club...',
    });
    await loading.present();
    try {
      if (!this.clubCreateForm.valid) throw new Error('Form is not valid');

      const club = new Club(
        '',
        this.clubCreateForm.get('name')?.value,
        { [this.drs.authUsers.value[0].uid]: this.drs.authUsers.value[0].username },
        [this.drs.authUsers.value[0].uid],
        [this.drs.authUsers.value[0].uid]
      );
      this.drs.createClub(club);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.logic.syncAdminSession();
      this.router.navigate(['/my-clubs']);
      await loading.dismiss();
      this.ns.showToast('Club erfolgreich erstellt.');
    } catch (error) {
      await loading.dismiss();
      this.ns.showToast(`Fehler: ${error.message}`);
    }
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
      ['free', 3],
    ]);
    return _.get(this.license?.value);
  }
}

function isValidLicenseKeyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return control.value !== 'FREEFORNOW' ? { invalidKey: { value: control.value } } : null;
  };
}
