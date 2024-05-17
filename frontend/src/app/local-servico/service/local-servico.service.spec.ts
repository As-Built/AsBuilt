import { TestBed } from '@angular/core/testing';

import { LocalServicoService } from './local-servico.service';

describe('LocalServicoService', () => {
  let service: LocalServicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalServicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
