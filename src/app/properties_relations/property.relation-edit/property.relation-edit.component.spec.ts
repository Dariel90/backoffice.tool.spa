import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyRelationEditComponent } from './property.relation-edit.component';

describe('PropertyRelationEditComponent', () => {
  let component: PropertyRelationEditComponent;
  let fixture: ComponentFixture<PropertyRelationEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyRelationEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyRelationEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
