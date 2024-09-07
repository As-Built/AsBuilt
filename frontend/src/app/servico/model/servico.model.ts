import { UnidadeMedidaModel } from "../../shared/model/unidade-medida.model";
import { TipoServicoModel } from "../../tipo-servico/model/tipo-servico.model";
import { CentroCustoModel } from "../../centro-custo/model/centro-custo.model";
import { LocalServicoModel } from "../../local-servico/model/local-servico.model";
import { UsuarioModel } from "../../usuario/model/usuario.model";

export class ServicoModel {
    id?: number;
    taskType: TipoServicoModel = new TipoServicoModel();
    unitaryValue: number = 0;
    dimension: number = 0;
    unitMeasurement: UnidadeMedidaModel = new UnidadeMedidaModel();
    costCenter: CentroCustoModel = new CentroCustoModel();
    taskLocation: LocalServicoModel = new LocalServicoModel();
    expectedStartDate: Date = new Date();
    startDate?: Date;
    expectedEndDate: Date = new Date();
    finalDate?: Date;
    amount: number = 0;
    obs: string = "";
    executors?: UsuarioModel[];
    evaluators?: UsuarioModel[];
}
