import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyMetadataAddComponent } from './property.metadata-add.component';

describe('PropertyMetadataAddComponent', () => {
  let component: PropertyMetadataAddComponent;
  let fixture: ComponentFixture<PropertyMetadataAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyMetadataAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyMetadataAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
