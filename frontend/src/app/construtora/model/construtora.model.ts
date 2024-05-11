import { EnderecoModel } from "src/app/shared/model/endereco.model";

export class ConstrutoraModel {
    id?: number;
    builderName: string = "";
    cnpj: string = "";
    phone: string = "";
    builderAddress: EnderecoModel = new EnderecoModel();
}