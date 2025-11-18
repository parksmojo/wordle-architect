import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuessSlot } from './guess-slot';

describe('GuessSlot', () => {
  let component: GuessSlot;
  let fixture: ComponentFixture<GuessSlot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuessSlot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuessSlot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
