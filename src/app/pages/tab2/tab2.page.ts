import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { InfoPopoverComponent } from 'src/app/components/info-popover/info-popover.component';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  athletes = [
    'Carl	Butler',
    'Nicholas	Bond',
    'Julian	Mackay',
    'Ruth	Hunter',
    'Adrian	Roberts',
    'Boris	Payne',
    'Gordon	Short',
    'Theresa	Skinner',
    'Audrey	Blake',
    'Andrea	Fraser',
    'Liam Greene',
    'Jake	Scott',
    'Nicholas	Manning',
    'Melanie	Edmunds',
    'Megan	Thomson',
    'Zoe	Bower',
    'Brandon	Terry',
    'Claire	Greene',
    'Brandon	Buckland',
    'Victoria	Martin',
  ];
  coaches = [
    'Max	Newman',
    'Felicity	Brown',
    'Christopher	Murray',
    'Sam	Gibson',
    'Harry	Newman',
  ];

  currentUserStatus = 0;
  statusColor = 'success';
  statusColors = ['success', 'danger', 'dark'];
  statusIcon = 'checkmark-circle-outline';
  statusIcons = [
    'checkmark-circle-outline',
    'close-circle-outline',
    'ellipse-outline',
  ];
  isUserCoach: boolean = false;
  constructor(private popoverController: PopoverController) {}

  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: InfoPopoverComponent,
      event: ev,
      translucent: true,
    });
    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
  toggleUserStatus() {
    this.currentUserStatus = (this.currentUserStatus + 1) % 3;
    this.statusColor = this.statusColors[this.currentUserStatus];
    this.statusIcon = this.statusIcons[this.currentUserStatus];
  }
}
