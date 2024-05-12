import { TestBed } from '@angular/core/testing';

import { CentroCustoService } from './cadastro-centro-custo.service';

describe('CadastroCentroCustoService', () => {
  let service: CentroCustoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentroCustoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
