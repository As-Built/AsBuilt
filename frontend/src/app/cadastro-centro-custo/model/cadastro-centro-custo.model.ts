import { EnderecoModel } from "src/app/shared/model/endereco.model";

export class CadastroCentroCustoModel {
    costCenterName: string = "";
    costCenterAddress: EnderecoModel = new EnderecoModel();
    valueUndertaken: number = 0;
    owner: string = "";
}
