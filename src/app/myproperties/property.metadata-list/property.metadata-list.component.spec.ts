import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyMetadataListComponent } from './property.metadata-list.component';

describe('PropertyMetadataListComponent', () => {
  let component: PropertyMetadataListComponent;
  let fixture: ComponentFixture<PropertyMetadataListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyMetadataListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyMetadataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
