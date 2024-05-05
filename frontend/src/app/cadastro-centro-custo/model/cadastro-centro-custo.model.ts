import { EnderecoModel } from "src/app/shared/model/endereco.model";

export class CadastroCentroCustoModel {
    nomeCentroDeCusto: string = "";
    enderecoCentroDeCusto: EnderecoModel = new EnderecoModel();
    valorEmpreendido: number = 0;
}
