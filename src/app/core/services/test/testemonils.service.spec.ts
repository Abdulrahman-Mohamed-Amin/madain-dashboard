import { TestBed } from '@angular/core/testing';

import { TestemonilsService } from './testemonils.service';

describe('TestemonilsService', () => {
  let service: TestemonilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestemonilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
