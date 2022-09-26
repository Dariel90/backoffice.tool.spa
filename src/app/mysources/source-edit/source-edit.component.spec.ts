import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceEditComponent } from './source-edit.component';

describe('SourceEditComponent', () => {
  let component: SourceEditComponent;
  let fixture: ComponentFixture<SourceEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
