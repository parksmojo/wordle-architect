import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolvePage } from './solve-page';

describe('PlayPage', () => {
  let component: SolvePage;
  let fixture: ComponentFixture<SolvePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolvePage],
    }).compileComponents();

    fixture = TestBed.createComponent(SolvePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
