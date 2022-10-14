import { TestBed } from '@angular/core/testing';

import { PropertyRelationService } from './property-relation.service';

describe('PropertyRelationService', () => {
  let service: PropertyRelationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyRelationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
