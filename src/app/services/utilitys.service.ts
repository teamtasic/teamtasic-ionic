import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UtilitysService {
  constructor(private afs: AngularFirestore) {}
  getDocumentRefWithConverterFromPath(path: string, converter: any) {
    return this.afs.firestore.doc(path).withConverter(converter);
  }
  getCollectionRefWithConverter(path: string, converter: any) {
    return this.afs.firestore.collection(path).withConverter(converter);
  }
}
