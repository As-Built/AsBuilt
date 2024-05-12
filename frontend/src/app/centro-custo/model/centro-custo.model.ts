import { ConstrutoraModel } from "../../construtora/model/construtora.model";
import { EnderecoModel } from "../../shared/model/endereco.model";

export class CentroCustoModel {
    costCenterName: string = "";
    costCenterAddress: EnderecoModel = new EnderecoModel();
    valueUndertaken: number = 0;
    expectedBudget: number = 0;
    builder: ConstrutoraModel = new ConstrutoraModel();
}
