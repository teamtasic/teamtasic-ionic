import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatManagerService {
  private _chats: ChatData[] = [];
  private observableChats: BehaviorSubject<ChatData[]> = new BehaviorSubject<
    ChatData[]
  >([]);
  constructor(chats) {}

  get chats() {
    return this.observableChats.asObservable();
  }

  addChat(chat: ChatData) {
    this._chats.push(chat);
    this.observableChats.next(Object.assign({}, this._chats));
  }
}

export class ChatData {
  title: string;
  h2: string;
  h3: string;
  avatarURL: string;
  messages: Message[];
  unreadCount: Number = 0;
  constructor(
    title: string,
    h2: string,
    h3: string,
    avatarURL: string,
    messages: Message[],
    unreadCount: Number
  ) {
    this.title = title;
    this.h2 = h2;
    this.h3 = h3;
    this.avatarURL = avatarURL;
    this.messages = messages;
    this.unreadCount = unreadCount;
  }
}
export class Message {
  sender: string;
  subject: string;
  content: string;
  constructor(sender: string, subject: string, content: string) {
    this.sender = sender;
    this.subject = subject;
    this.content = content;
  }
}
