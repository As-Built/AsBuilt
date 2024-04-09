import { Component } from '@angular/core';
import { CadastroUsuarioModel } from './model/cadastro-usuario.model';
import { CadastroUsuarioService } from './service/cadastro-usuario.service';
import { firstValueFrom } from 'rxjs';

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
    }
    //TODO: Alterar para boolean
    var emailCadastrado = await firstValueFrom(this.cadastoUsuarioService.verificarEmailJaCadastrado(this.cadastroModel.email));
    if (emailCadastrado === null) {
      alert("Este email já está cadastrado!");
      return;
    }
    else {
      //TODO: Alterar para boolean
      var cpfCadastrado = await firstValueFrom(this.cadastoUsuarioService.verificarCpfJaCadastrado(this.cadastroModel.cpf));
      if (cpfCadastrado === null) {
        alert("Este CPF já está cadastrado!");
        return;
      }
      else {
        this.cadastoUsuarioService.signUp(this.cadastroModel).subscribe(
          retorno => {
          alert("Cadastro realizado com sucesso!");
        },
        (error) => {
          alert("Erro ao cadastrar usuário, comunique o administrador!");
        });
      }
    }
  }

}
