import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromGift } from './from-gift';

describe('FromGift', () => {
  let component: FromGift;
  let fixture: ComponentFixture<FromGift>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FromGift]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FromGift);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
