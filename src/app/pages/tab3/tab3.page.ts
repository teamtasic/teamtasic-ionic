import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChatData } from 'src/app/services/chat-manager.service';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  AVATAR: string =
    'https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y';
  constructor(private router: Router) {}
  chats: ChatData[] = [
    new ChatData(
      'Trainerchat RN3',
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero, tenetur!',
      'TrainerA',
      this.AVATAR,
      [],
      2
    ),
    new ChatData(
      'Trainerchat RN2',
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero, tenetur!',
      'askyfn',
      this.AVATAR,
      [],
      0
    ),
    new ChatData(
      'Trainerchat RN1',
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero, tenetur!',
      'TrainerG',
      this.AVATAR,
      [],
      1
    ),
  ];

  openChatView() {
    this.router.navigateByUrl('/chat-view/0');
  }
}
