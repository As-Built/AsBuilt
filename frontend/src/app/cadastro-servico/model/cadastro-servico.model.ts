export class CadastroServicoModel {
    tipoServico: string = "";
    valorUnitario: number = 0;
    dimensao: number = 0;
    unidadeMedida: string = "";
    localExecucao: string = "";
    dataInicio: Date = new Date();
    previsaoTermino: Date = new Date();
    dataFinal: Date = new Date();
    valorTotal: number = 0;
    obs: string = "";
}
