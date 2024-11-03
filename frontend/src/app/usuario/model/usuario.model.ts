import { SalarioModel } from "../../shared/model/salario.model";

export class UsuarioModel {
    public id: number = 0;
    public email: string = "";
    public password: string = "";
    public userType: number = 0;
    public name: string = "";
    public cpf: string = "";
    public salaries?: SalarioModel[];
}