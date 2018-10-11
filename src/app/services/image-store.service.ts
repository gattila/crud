import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { UploadResult } from './image-store-uploadresult';

@Injectable({ providedIn: 'root' })

export class ImageStoreService 
  {
  constructor() { }

  storeImage(basePath:string, file:File): Promise<UploadResult>
    {
      const fileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      const storageRef = firebase.storage().ref(`${basePath}/${fileName}`);

      return new Promise<UploadResult>(resolve => storageRef.put(file).
        then(() => storageRef.getDownloadURL().then(c => resolve({name: fileName, url: c}))));           
    }

  }
