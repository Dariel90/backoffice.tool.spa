import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyRelationAddComponent } from './property.relation-add.component';

describe('PropertyRelationAddComponent', () => {
  let component: PropertyRelationAddComponent;
  let fixture: ComponentFixture<PropertyRelationAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyRelationAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyRelationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
