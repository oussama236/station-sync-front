import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCarburantComponent } from './edit-carburant.component';

describe('EditCarburantComponent', () => {
  let component: EditCarburantComponent;
  let fixture: ComponentFixture<EditCarburantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditCarburantComponent]
    });
    fixture = TestBed.createComponent(EditCarburantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
