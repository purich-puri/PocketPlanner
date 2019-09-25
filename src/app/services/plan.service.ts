import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { take, map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, forkJoin, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  constructor(
    private db: AngularFirestore,
    private auth: AuthService,
    private afAuth: AngularFireAuth
  ) { }

  // createPlan(title, description){
  //   let currentUser = {
  //     email: this.auth.currentUser.email,
  //     id: this.auth.currentUserId,
  //     displayName: this.auth.nickname
  //   }

  //   return this.db.collection(`users/${this.auth.currentUserId}/plans`).add({
  //     title: title,
  //     description: description,
  //     owner: currentUser,
  //     created: firebase.firestore.FieldValue.serverTimestamp()
  //   }).then(res => {
  //   });
  // }

  createPlan(title, description){
    let currentUser = {
      email: this.auth.currentUser.email,
      id: this.auth.currentUserId,
      displayName: this.auth.nickname
    }

    return this.db.collection(`allPlans`).add({
      title: title,
      description: description,
      //tag: countryName,
      owner: currentUser,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      isShown: false,
      viewCount: []
    }).then(res => {
      let promises = [];
 
      let oneAdd = this.db.collection(`users/${this.auth.currentUserId}/plans`).add({
        id: res.id
      });
      promises.push(oneAdd);
      return Promise.all(promises);
    });
  }

  shareYourPlan(id, isShown){
    return this.db.doc(`allPlans/${id}`).update({
      isShown
    });
  }

  editDescriptionInfo(planID, description){
    return this.db.doc(`allPlans/${planID}`).update({
      description
    });
  }

  editDestination(planID, DestID, start, end){
    return this.db.doc(`allPlans/${planID}/destinations/${DestID}`).update({
      startpoint: start,
      endpoint: end
    });
  }

  updateViewCounter(planID, userID){
    
  }

  //  getPlans(){
  //     //console.log(this.auth.currentUserId);
  //     return this.db.collection(`users/${this.auth.currentUserId}/plans`, ref => ref.orderBy('created', 'desc')).snapshotChanges().pipe(
  //     map(actions => actions.map(a => {
  //       const data = a.payload.doc.data();
  //       const id = a.payload.doc.id;
  //       return {id, ...data};
  //     }))
  //   ) 
  //  }

  getAllPlans(){
    return this.db.collection(`allPlans`).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    )
  }

  getPlans() {
    //console.log("userID: " + this.auth.currentUserId);
    return this.db.collection(`users/${this.auth.currentUserId}/plans`).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const user_group_key = a.payload.doc.id;
        return this.getOneGroup(data['id'], user_group_key);
      }))
    )
  }

  getOneGroup(id, user_group_key = null) {
    return this.db.doc(`allPlans/${id}`).snapshotChanges().pipe(
      take(1),
      map(changes => {
        const data = changes.payload.data();
        const group_id = changes.payload.id;
        return { user_group_key, id: group_id, ...data };
      })
    )
  }

  saveDestination(planID, startPoint, endPoint){
    return this.db.collection(`allPlans/${planID}/destinations`).add({
      startpoint: startPoint,
      endpoint: endPoint,
      created: firebase.firestore.FieldValue.serverTimestamp()
    }).then( res => {
    });
  }

   getDestinations(planID){
    return this.db.collection(`allPlans/${planID}/destinations`, ref => ref.orderBy('created', 'asc')).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id, ...data};
      }))
    ) 
   }

   getDestinationEdit(planID, destID){
    return this.db.doc(`allPlans/${planID}/destinations/${destID}`);
   }

  //  deletePlan(id){
  //    return this.db.doc(`allPlans/${id}`).delete();
  //  }

  deletePlan(planID){
    return this.getPlans().pipe(
      switchMap(userGroups => {
        return forkJoin(userGroups);
      }),
      map(data => {
        let toDelete = null;
 
        for (let plan of data) {
          if (plan.id == planID) {
            toDelete = plan.user_group_key;
          }
        }
        //console.log(toDelete);
        return toDelete;
      }),
      switchMap(deleteId => {
        return from(this.db.doc(`users/${this.auth.currentUserId}/plans/${deleteId}`).delete())
      }),
      switchMap(() => {
        return from(this.db.doc(`allPlans/${planID}`).delete())
      })
    );
  }

   deleteDestination(planID, destinationID){
    return this.db.doc(`allPlans/${planID}/destinations/${destinationID}`).delete();
   }
     
}
