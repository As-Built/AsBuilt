import { TestBed } from '@angular/core/testing';

import { UnidadeMedidaService } from './unidade-medida.service';

describe('UnidadeMedidaService', () => {
  let service: UnidadeMedidaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnidadeMedidaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
