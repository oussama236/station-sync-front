import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiIndexComponent } from './ai-index.component';

describe('AiIndexComponent', () => {
  let component: AiIndexComponent;
  let fixture: ComponentFixture<AiIndexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiIndexComponent]
    });
    fixture = TestBed.createComponent(AiIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
