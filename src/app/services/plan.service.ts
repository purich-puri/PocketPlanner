import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { take, map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(
    private db: AngularFirestore,
    private auth: AuthService,
    private afAuth: AngularFireAuth
  ) { }

  createPlan(title, description){
    let currentUser = {
      email: this.auth.currentUser.email,
      id: this.auth.currentUserId,
      displayName: this.auth.nickname
    }

    return this.db.collection(`users/${this.auth.currentUserId}/plans`).add({
      title: title,
      description: description,
      owner: currentUser,
      created: firebase.firestore.FieldValue.serverTimestamp()
    }).then(res => {
    });
  }

  shareYourPlan(id){

  }

   getPlans(){
      //console.log(this.auth.currentUserId);
      return this.db.collection(`users/${this.auth.currentUserId}/plans`, ref => ref.orderBy('created', 'desc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    ) 
   }

   deletePlan(id){
     return this.db.doc(`users/${this.auth.currentUserId}/plans/${id}`).delete();
   }
}
