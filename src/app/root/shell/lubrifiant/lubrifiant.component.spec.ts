import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LubrifiantComponent } from './lubrifiant.component';

describe('LubrifiantComponent', () => {
  let component: LubrifiantComponent;
  let fixture: ComponentFixture<LubrifiantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LubrifiantComponent]
    });
    fixture = TestBed.createComponent(LubrifiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
