import { TestBed } from '@angular/core/testing';

import { Comms } from './comms';

describe('Comms', () => {
  let service: Comms;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Comms);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
