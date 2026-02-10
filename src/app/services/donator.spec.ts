import { TestBed } from '@angular/core/testing';

import { Donator } from './donator';

describe('Donator', () => {
  let service: Donator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Donator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
