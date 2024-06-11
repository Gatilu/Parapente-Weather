import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  createUser(uid: string, data: any) {
    return this.firestore.collection('users').doc(uid).set(data);
  }

  getUser(uid: string) {
    return this.firestore.collection('users').doc(uid).valueChanges();
  }

  updateUser(uid: string, data: any) {
    return this.firestore.collection('users').doc(uid).update(data);
  }

  deleteUser(uid: string) {
    return this.firestore.collection('users').doc(uid).delete();
  }
}
