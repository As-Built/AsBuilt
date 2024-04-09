import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroUsuarioComponent } from './cadastro-usuario.component';

describe('CadastroUsuarioComponent', () => {
  let component: CadastroUsuarioComponent;
  let fixture: ComponentFixture<CadastroUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroUsuarioComponent]
    });
    fixture = TestBed.createComponent(CadastroUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
