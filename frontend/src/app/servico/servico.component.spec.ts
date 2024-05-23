import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroServicoComponent } from './cadastro-servico.component';

describe('CadastroServicoComponent', () => {
  let component: CadastroServicoComponent;
  let fixture: ComponentFixture<CadastroServicoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroServicoComponent]
    });
    fixture = TestBed.createComponent(CadastroServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
