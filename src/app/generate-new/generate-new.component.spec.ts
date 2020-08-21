import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateNewComponent } from './generate-new.component';

describe('GenerateNewComponent', () => {
  let component: GenerateNewComponent;
  let fixture: ComponentFixture<GenerateNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenerateNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
