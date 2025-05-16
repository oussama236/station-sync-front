import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShellIndexComponent } from './shell-index.component';

describe('ShellIndexComponent', () => {
  let component: ShellIndexComponent;
  let fixture: ComponentFixture<ShellIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShellIndexComponent]
    });
    fixture = TestBed.createComponent(ShellIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
