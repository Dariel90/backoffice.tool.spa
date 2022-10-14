import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyRelationListComponent } from './property.relation-list.component';

describe('PropertyRelationListComponent', () => {
  let component: PropertyRelationListComponent;
  let fixture: ComponentFixture<PropertyRelationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyRelationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyRelationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
