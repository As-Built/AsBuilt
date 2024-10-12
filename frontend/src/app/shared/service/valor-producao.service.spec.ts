import { TestBed } from '@angular/core/testing';

import { ValorProducaoService } from './valor-producao.service';

describe('ValorProducaoService', () => {
  let service: ValorProducaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValorProducaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
