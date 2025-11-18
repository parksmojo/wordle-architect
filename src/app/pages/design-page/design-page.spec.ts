import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignPage } from './design-page';

describe('DesignPage', () => {
  let component: DesignPage;
  let fixture: ComponentFixture<DesignPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
