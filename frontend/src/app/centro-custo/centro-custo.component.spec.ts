import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroCustoComponent } from './cadastro-centro-custo.component';

describe('CadastroCentroCustoComponent', () => {
  let component: CentroCustoComponent;
  let fixture: ComponentFixture<CentroCustoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CentroCustoComponent]
    });
    fixture = TestBed.createComponent(CentroCustoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
