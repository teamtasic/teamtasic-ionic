import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent, ModalController } from '@ionic/angular';
import { Meet } from 'src/app/classes/meet';
import { MeetCreateComponent } from 'src/app/components/meet-create/meet-create.component';
import { TrainingDetailViewComponent } from 'src/app/components/training-detail-view/training-detail-view.component';
import { DataRepositoryService } from 'src/app/services/data-repository.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, AfterViewInit {
  today: string = new Date(Date.now()).toISOString();

  teamId: string;
  clubId: string;
  sessionId: string;

  meets: Meet[] = [];

  @ViewChild(IonContent) content: IonContent;

  constructor(
    public modalController: ModalController,
    private fb: FormBuilder,
    public drs: DataRepositoryService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.teamId = params.get('teamId');
      this.clubId = params.get('clubId');
      this.sessionId = params.get('sessionId');
      console.log(this.teamId, this.clubId, this.sessionId);
    });

    this.drs.syncMeetsForTeam(this.teamId, this.clubId).subscribe((meets) => {
      console.log(meets);
      this.meets = meets;
    });
  }
  ngAfterViewInit() {
    this.content.scrollToBottom(300);
  }

  async addTraining() {
    const modal = await this.modalController.create({
      component: MeetCreateComponent,
      componentProps: {
        teamId: this.teamId,
        clubId: this.clubId,
      },
    });
    await modal.present();
  }
}
