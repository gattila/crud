import { TestBed } from '@angular/core/testing';

import { ImageStoreService } from './image-store.service';

describe('ImageStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageStoreService = TestBed.get(ImageStoreService);
    expect(service).toBeTruthy();
  });
});
