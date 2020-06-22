import { TestBed } from '@angular/core/testing';

import { ServerdataService } from './serverdata.service';

describe('ServerdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServerdataService = TestBed.get(ServerdataService);
    expect(service).toBeTruthy();
  });
});
