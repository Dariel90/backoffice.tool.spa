import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceAddComponent } from './source-add.component';

describe('SourceAddComponent', () => {
  let component: SourceAddComponent;
  let fixture: ComponentFixture<SourceAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourceAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
