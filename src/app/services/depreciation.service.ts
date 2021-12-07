import { Injectable } from '@angular/core';
import * as fb from 'firebase';
@Injectable({
  providedIn: 'root',
})
export class DepreciationService {
  remoteConfig: Object;

  constructor() {
    this.remoteConfig = fb.default.remoteConfig();
  }
}
