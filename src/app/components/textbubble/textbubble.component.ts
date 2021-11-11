import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'textbubble',
  templateUrl: './textbubble.component.html',
  styleUrls: ['./textbubble.component.scss'],
})
export class TextbubbleComponent implements OnInit {
  constructor() {}

  @Input() text: string = 'heyhoo';
  @Input() sender: string = 'me';
  @Input() sentByMe: boolean = false;
  @Input() showSender: boolean = true;
  ngOnInit() {}
}
