export class CadastroServicoModel {
    taskType: string = "";
    unitaryValue: number = 0;
    dimension: number = 0;
    unitMeasurement: string = "";
    costCenterId: number = 0;
    placeOfExecution: string = "";
    startDate: Date = new Date();
    expectedEndDate: Date = new Date();
    finalDate: Date = new Date();
    amount: number = 0;
    obs: string = "";
}
