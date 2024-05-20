import { TestBed } from '@angular/core/testing';

import { TiposServicoService } from './tipos-servico.service';

describe('TiposServicoService', () => {
  let service: TiposServicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TiposServicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
