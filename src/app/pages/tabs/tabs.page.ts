import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  @ViewChild(IonTabs) tabs: IonTabs;
  selected = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    if (!this.authService.isAuthenticated.getValue()) {
      this.router.navigate(['/login']);
    }
  }

  ngOnInit() {}

  setSelectedTab() {
    this.selected = this.tabs.getSelected();
  }
}
