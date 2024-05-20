import { UnidadeMedidaModel } from "src/app/shared/model/unidade-medida.model";

export class TipoServicoModel {
    id?: number;
    taskTypeName: string = "";
    taskTypeDescription: string = "";
    unitMeasurement: UnidadeMedidaModel = new UnidadeMedidaModel();
    parameter0Name: string = "";
    parameter0Result: boolean = false;
    parameter1Name: string = "";
    parameter1Result: boolean = false;
    parameter2Name: string = "";
    parameter2Result: boolean = false;
    parameter3Name?: string;
    parameter3Result: boolean = false;
    parameter4Name?: string;
    parameter4Result: boolean = false;
    parameter5Name?: string;
    parameter5Result: boolean = false;
    parameter6Name?: string;
    parameter6Result: boolean = false;
    parameter7Name?: string;
    parameter7Result: boolean = false;
    parameter8Name?: string;
    parameter8Result: boolean = false;
    parameter9Name?: string;
    parameter9Result: boolean = false;
    comments?: string;
    [key: string]: any;
}