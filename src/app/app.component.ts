import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent 
  {
  title = 'CrUD application demo';

  constructor(public afAuth: AngularFireAuth,  public router: Router) { }

  login() 
    {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }

  logout() 
    {
    this.afAuth.auth.signOut();
    }

  }
