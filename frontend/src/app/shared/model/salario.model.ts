import { UsuarioModel } from "src/app/usuario/model/usuario.model";

export class SalarioModel {
    id?: number;
    value: number = 0;
    updateDate: Date = new Date();
    user: UsuarioModel = new UsuarioModel();
}