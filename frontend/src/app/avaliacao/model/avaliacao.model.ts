import { ServicoModel } from "src/app/servico/model/servico.model"
import { UsuarioModel } from "src/app/usuario/model/usuario.model";

export class AvaliacaoModel {
    task: ServicoModel = new ServicoModel();
    taskExecutors: UsuarioModel[] = [];
    taskLecturer: UsuarioModel = new UsuarioModel();
    appraisalDate: Date = new Date();
    parameter0Result: boolean = false;
    parameter1Result: boolean = false;
    parameter2Result: boolean = false;
    parameter3Result?: boolean;
    parameter4Result?: boolean;
    parameter5Result?: boolean;
    parameter6Result?: boolean;
    parameter7Result?: boolean;
    parameter8Result?: boolean;
    parameter9Result?: boolean;
    appraisalResult: boolean = false;
    obs: string = "";
}