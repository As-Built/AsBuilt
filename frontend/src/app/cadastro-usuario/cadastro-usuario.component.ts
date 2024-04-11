import { Component } from '@angular/core';
import { CadastroUsuarioModel } from './model/cadastro-usuario.model';
import { CadastroUsuarioService } from './service/cadastro-usuario.service';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrls: ['./cadastro-usuario.component.scss']
})
export class CadastroUsuarioComponent {
  cadastroModel = new CadastroUsuarioModel();
  verificarSenha: string = '';
  constructor(private cadastoUsuarioService: CadastroUsuarioService) { }

  async signUp(){
    if (this.verificarSenha != this.cadastroModel.password) {
      alert("As senhas não conferem!");
      return;

    } else {
      this.cadastoUsuarioService.signUp(this.cadastroModel).subscribe(
        retorno => {
        alert("Cadastro realizado com sucesso!");
      },
      (error) => {
        if (error.error === "A user with same CPF already exists") {
          alert("Já existe um usuário cadastrado com este CPF!");
        }
        else if (error.error === "A user with same EMAIL already exists") {
          alert("Já existe um usuário cadastrado com este email!");
        }
        else {
          alert(error.error);
        }
      });
    }
  }

}
