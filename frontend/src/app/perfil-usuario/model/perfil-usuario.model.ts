import { SalarioModel } from "src/app/shared/model/salario.model";
import { EnderecoModel } from "../../shared/model/endereco.model";
import { RolesModel } from "src/app/shared/model/roles.model";

export class PerfilUsuarioModel {
    public id: number = 0;
    public email: string = "";
    public name: string = "";
    public cpf: string = "";
    public phone: string = "";
    public userAddress: EnderecoModel = new EnderecoModel();
    public photo: string = "";
    public salaries: SalarioModel[] = [];
    public systemLanguage: string = "";
    public roles: RolesModel[] = [];
}