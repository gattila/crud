import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({ providedIn: 'root' })

export class ImageStoreService 
  {
  constructor() { }

  basePath = '/productImages';

  GenerateImageName():string
    {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);  
    }

  StoreImage(fileName:string, file:File, progress:(percent:number)=>void, error:(er:Error)=>void, finish:(url:string)=>void)
    {
    const storageRef = firebase.storage().ref(`${this.basePath}/${fileName}`);

    storageRef.put(file).on(firebase.storage.TaskEvent.STATE_CHANGED,
        (sn:firebase.storage.UploadTaskSnapshot) => progress(Math.round((sn.bytesTransferred / sn.totalBytes) * 100)),        
        (er:Error)=>error(er), 
        ()=> { storageRef.getDownloadURL().then(w => finish(w)); });    
    }

  }
