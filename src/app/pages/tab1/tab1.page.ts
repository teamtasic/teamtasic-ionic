import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Training } from 'src/app/services/data-repository.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  userHasJoinedTeam: boolean = true;
  hasTrainings: boolean = true;
  trainings: Training[] = [
    new Training(
      '',
      'Training',
      'Techniktraining, Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, cupiditate.',
      '',
      new Date('2021-07-15T14:00')
    ),
    new Training(
      '',
      'Training',
      'Techniktraining, Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, cupiditate.',
      '',
      new Date('2021-07-18T14:00')
    ),
    new Training(
      '',
      'Training',
      'Techniktraining, Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, cupiditate.',
      '',
      new Date('2021-07-20T14:00')
    ),
    new Training(
      '',
      'Training',
      'Techniktraining, Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, cupiditate.',
      '',
      new Date('2021-07-23T14:00')
    ),
  ];
  constructor(private auth: AuthService) {
    //this.trainings = [];
  }
}
