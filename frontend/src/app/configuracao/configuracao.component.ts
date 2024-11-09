import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { catchError, firstValueFrom, of, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { SalarioModel } from '../shared/model/salario.model';
import { SalarioService } from '../shared/service/salario.service';
import { PerfilUsuarioModel } from '../perfil-usuario/model/perfil-usuario.model';
import { PerfilUsuarioService } from '../perfil-usuario/service/perfil-usuario.service';
import { RolesModel } from '../shared/model/roles.model';
import { RolesService } from '../shared/service/roles.service';

@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.scss']
})
export class ConfiguracaoComponent implements OnInit {


  userName: string = "";
  userId: number = 0;
  usuarios: PerfilUsuarioModel[] = [];
  usuarioSelecionado: PerfilUsuarioModel | null = null;
  remuneracaoNova: SalarioModel = new SalarioModel();
  remuneracaoAntiga: number = 0;
  dataUltimaAtualizacaoFormatada: string = "";
  remuneracaoAlterada: boolean = false;
  salarioModel: SalarioModel = new SalarioModel();
  isAdmin: boolean = false;
  rolesCadastradas: RolesModel[] = [];
  roleAdicionalSelecionada: RolesModel | null = null;
  roleAdicionalAlterada: boolean = false;

  constructor(
    private salarioService: SalarioService,
    private spinner: NgxSpinnerService,
    private perfilUsuarioService: PerfilUsuarioService,
    private rolesService: RolesService
  ) { }

  async ngOnInit() {
    this.getUserFromToken();
    if (this.isAdmin) {
      await this.buscarUsuarios();
      await this.listarRoles();

    } else {
      await this.buscarUsarioPorId(this.userId);
      this.onUsuarioChange(new Event(''));
    }
  }

  private getUserFromToken() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token!) as any;
    const userRoles = decodedToken.user.roles;
    this.userName = decodedToken.user.name;
    this.userId = decodedToken.user.id;
    this.isAdmin = userRoles.includes('ADMIN');
  }

  async buscarUsuarios() {
    this.spinner.show();
    try {
      const usuarios = await firstValueFrom(this.perfilUsuarioService.listarUsuarios());
      this.usuarios = usuarios;
    } catch (error) {
      console.error(error);
    }
    this.spinner.hide();
  }

  async buscarUsarioPorId(id: number) {
    this.spinner.show();
    try {
      const usuario = await firstValueFrom(this.perfilUsuarioService.buscarUsuarioPorId(id));
      this.usuarioSelecionado = usuario;
    } catch (error) {
      console.error(error);
    }
    this.spinner.hide();
  }

  onUsuarioChange(event: Event) {
    if (this.usuarioSelecionado) {
      let ultimoSalario = new SalarioModel();
      ultimoSalario.updateDate = new Date(0);
      if (this.usuarioSelecionado.salaries) {
        this.usuarioSelecionado.salaries.forEach((salario) => {
          if (new Date(salario.updateDate) > new Date(ultimoSalario.updateDate)) {
            this.remuneracaoAntiga = salario.value;
            this.remuneracaoNova = salario;
            ultimoSalario = salario;
            this.dataUltimaAtualizacaoFormatada = formatDate(this.remuneracaoNova.updateDate, "dd/MM/yyyy", "pt-BR");
          }
          else {
            this.remuneracaoAntiga = ultimoSalario.value;
            this.remuneracaoNova = ultimoSalario;
          }
        });
      }
    }
  }

  onRemuneracaoChange(newValue: any): void {
    this.remuneracaoAlterada = true;
    this.remuneracaoNova.updateDate = new Date();
  }

  numberOnly(event: { which: any; keyCode: any; }): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  validarRemuneracao(novoSalario: number): boolean {
    if (this.remuneracaoAntiga >= novoSalario) {
      Swal.fire({
        text: "A nova remuneração deve ser maior que a atual!",
        icon: "warning",
        showConfirmButton: false,
        timer: 3000
      });
      return false;
    } else {
      return true;
    }
  }

  async atualizarRemuneracaoUsuario() {
    if (this.usuarioSelecionado) {
        let novoSalario = new SalarioModel();
        novoSalario.id = undefined;
        novoSalario.value = this.remuneracaoNova.value;
        novoSalario.updateDate = new Date();
        novoSalario.user = this.usuarioSelecionado;
        if (this.validarRemuneracao(novoSalario.value)) {
            this.spinner.show();
            try {
                const retorno = await firstValueFrom(this.salarioService.inserirSalario(novoSalario));
                this.spinner.hide();
                Swal.fire({
                    text: "Atualização realizada com sucesso!",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
                this.remuneracaoAlterada = false;
            } catch (error: any) {
                console.log(error);
                this.spinner.hide();
                Swal.fire({
                    text: error.error ? error.error : 'Erro desconhecido',
                    icon: "error",
                    showConfirmButton: false,
                    timer: 2000
                });
                this.remuneracaoAlterada = false;
            }
        }
    } else {
        this.remuneracaoAlterada = false;
        this.spinner.hide();
        Swal.fire({
            text: "Nenhum usuário selecionado!",
            icon: "error",
            showConfirmButton: false,
            timer: 2000
        });
    }
}

  onRoleAdicionalChange(event: Event) {
    if (this.usuarioSelecionado) {
      const rolesAtuais = this.usuarioSelecionado.roles;
      if (this.roleAdicionalSelecionada) {
        // Verifica se a role selecionada já existe no usuário
        const roleExists = rolesAtuais.some(role => role.description === this.roleAdicionalSelecionada!!.description);
        if (!roleExists) {
          this.roleAdicionalAlterada = true;
        } else {
          this.roleAdicionalAlterada = false;
        }
      }
    }
  }

  atualizarRoleUsuario() {
    if (this.usuarioSelecionado && this.roleAdicionalSelecionada) {
      this.rolesService.adicionarRole(this.usuarioSelecionado.id, this.roleAdicionalSelecionada.name).pipe(
        tap(retorno => {
          this.spinner.hide();
          Swal.fire({
            text: "Role adicionada com sucesso!",
            icon: "success",
            showConfirmButton: false,
            timer: 2000
          });
          this.remuneracaoAlterada = false;
        }),
        catchError(error => {
          console.log(error);
          this.spinner.hide();
          Swal.fire({
            text: error.error,
            icon: "error",
            showConfirmButton: false,
            timer: 2000
          });
          this.remuneracaoAlterada = false;
          return of();
        })
      ).subscribe();
    }
  }

  async listarRoles() {
    try {
      const roles = await firstValueFrom(this.rolesService.listarRoles());
      this.rolesCadastradas = roles;
    } catch (error) {
      console.error(error);
    }
  }

  limparCampos() {
    this.usuarioSelecionado = null;
  }

}
