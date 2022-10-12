import { TestBed } from '@angular/core/testing';

import { PropertyMetadataService } from './property-metadata.service';

describe('PropertyMetadataService', () => {
  let service: PropertyMetadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyMetadataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
