import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { NotificationService } from 'src/app/services/notification-service.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'tt-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @Input() fileName: string = 'file';
  constructor(private afStorage: AngularFireStorage, private ns: NotificationService) {}
  name = '';
  @Input() promtText = 'Datei Hochladen';
  @Input() accept = '.png, .jpg, .jpeg';

  @Output() fileUploaded = new EventEmitter<{
    url: string;
  }>();

  ngOnInit() {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.name = file.name;
      const upload$ = this.afStorage.upload(`raw_profiles/${this.fileName}`, file);

      upload$
        .then(() => {
          this.ns.showToast('Datei erfolgreich hochgeladen');
          this.fileUploaded.emit({
            url: `https://storage.cloud.google.com/${environment.firebase.storageBucket}/profiles/${this.fileName}_200x200`,
          });
        })
        .catch((err) => {
          this.ns.showToast('Fehler beim Hochladen der Datei');
        });
    } else {
      // canceled
    }
  }
}
