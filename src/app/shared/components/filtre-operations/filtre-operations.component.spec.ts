import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltreOperationsComponent } from './filtre-operations.component';

describe('FiltreOperationsComponent', () => {
  let component: FiltreOperationsComponent;
  let fixture: ComponentFixture<FiltreOperationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FiltreOperationsComponent]
    });
    fixture = TestBed.createComponent(FiltreOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
