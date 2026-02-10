import { TestBed } from '@angular/core/testing';

import { PurchasesService } from './purchases.service';

describe('PurchasesService', () => {
  let service: PurchasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  
  it('should fetch all purchases', () => {
  });

  it('should fetch purchase by id', () => {
 
  });

  it('should add a new purchase', () => {
   });

  it('should update purchase quantity', () => {
   });

  it('should delete a purchase', () => {
  });

  it('should update purchase status', () => {
  });
});
