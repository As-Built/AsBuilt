import { EnderecoModel } from "src/app/shared/model/endereco.model";

export class PerfilUsuarioModel {
    public id: number = 0;
    public email: string = "";
    public name: string = "";
    public cpf: string = "";
    public phone: string = "";
    public userAddress: EnderecoModel = new EnderecoModel();
    public photo: string = "";
}