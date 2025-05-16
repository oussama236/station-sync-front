import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvoirComponent } from './avoir.component';

describe('AvoirComponent', () => {
  let component: AvoirComponent;
  let fixture: ComponentFixture<AvoirComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvoirComponent]
    });
    fixture = TestBed.createComponent(AvoirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
