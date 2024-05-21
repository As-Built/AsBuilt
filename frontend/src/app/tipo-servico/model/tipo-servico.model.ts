import { UnidadeMedidaModel } from "src/app/shared/model/unidade-medida.model";

export class TipoServicoModel {
    id?: number;
    taskTypeName: string = "";
    taskTypeDescription: string = "";
    unitMeasurement: UnidadeMedidaModel = new UnidadeMedidaModel();
    parameter0Name: string = "";
    parameter1Name: string = "";
    parameter2Name: string = "";
    parameter3Name?: string;
    parameter4Name?: string;
    parameter5Name?: string;
    parameter6Name?: string;
    parameter7Name?: string;
    parameter8Name?: string;
    parameter9Name?: string;
    comments?: string;
    [key: string]: any;
}