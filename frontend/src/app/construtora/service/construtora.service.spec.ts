import { TestBed } from '@angular/core/testing';

import { ConstrutoraService } from './construtora.service';

describe('ConstrutoraService', () => {
  let service: ConstrutoraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConstrutoraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
