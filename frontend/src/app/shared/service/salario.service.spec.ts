import { TestBed } from '@angular/core/testing';

import { SalarioService } from './salario.service';

describe('SalarioService', () => {
  let service: SalarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
