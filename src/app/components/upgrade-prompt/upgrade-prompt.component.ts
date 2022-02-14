import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-upgrade-prompt',
  templateUrl: './upgrade-prompt.component.html',
  styleUrls: ['./upgrade-prompt.component.scss'],
})
export class UpgradePromptComponent implements OnInit {
  constructor() {}

  platform: 'android' | 'ios' | 'web' = 'web';

  ngOnInit() {
    let p = Capacitor.getPlatform();
    if (p == 'android') {
      this.platform = 'android';
    }
    if (p == 'ios') {
      this.platform = 'ios';
    }
    console.log(p);
  }
}
