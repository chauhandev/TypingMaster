import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypingTestComponent } from './typing-test.component';

describe('TypingTestComponent', () => {
  let component: TypingTestComponent;
  let fixture: ComponentFixture<TypingTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypingTestComponent]
    });
    fixture = TestBed.createComponent(TypingTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
