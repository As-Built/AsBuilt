import { TestBed } from '@angular/core/testing';

import { LanguageSelectorService } from './language-selector.service';

describe('LanguageSelectorService', () => {
  let service: LanguageSelectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LanguageSelectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
