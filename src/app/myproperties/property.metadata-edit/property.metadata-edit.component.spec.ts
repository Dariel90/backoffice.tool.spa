import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyMetadataEditComponent } from './property.metadata-edit.component';

describe('PropertyMetadataEditComponent', () => {
  let component: PropertyMetadataEditComponent;
  let fixture: ComponentFixture<PropertyMetadataEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyMetadataEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyMetadataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
