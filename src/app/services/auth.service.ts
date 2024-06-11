import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private firestore: AngularFirestore) {}

  register(firstName: string, email: string, password: string, cpf: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password).then((result) => {
      return this.firestore.doc(`users/${result.user?.uid}`).set({
        firstName,
        email,
        cpf
      });
    });
  }

  login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.afAuth.signOut();
  }

  getUserData(): Observable<any> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);  // Utilize 'of(null)' para retornar um Observable com valor 'null'
        }
      })
    );
  }
}
