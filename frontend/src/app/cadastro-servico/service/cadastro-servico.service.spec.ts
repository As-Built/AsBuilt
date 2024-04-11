import { TestBed } from '@angular/core/testing';

import { CadastroServicoService } from './cadastro-servico.service';

describe('CadastroServicoService', () => {
  let service: CadastroServicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CadastroServicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
