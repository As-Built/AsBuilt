import { TestBed } from '@angular/core/testing';

import { CadastroCentroCustoService } from './cadastro-centro-custo.service';

describe('CadastroCentroCustoService', () => {
  let service: CadastroCentroCustoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CadastroCentroCustoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
