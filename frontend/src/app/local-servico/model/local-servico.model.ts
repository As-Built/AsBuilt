import { CentroCustoModel } from "src/app/centro-custo/model/centro-custo.model";

export class LocalServicoModel {
    id?: number;
    costCenter: CentroCustoModel = new CentroCustoModel();
    locationGroup: string = "";
    subGroup1?: string;
    subGroup2?: string;
    subGroup3?: string;
}