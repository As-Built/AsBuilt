import { ServicoModel } from "src/app/servico/model/servico.model";
import { UsuarioModel } from "src/app/usuario/model/usuario.model";

export class AvaliacaoModel {
    id?: number;
    task: ServicoModel = new ServicoModel();
    taskExecutors: UsuarioModel[] = [];
    taskEvaluators: UsuarioModel[] = [];
    assessmentDate: Date = new Date();
    parameter0Result?: boolean;
    parameter1Result?: boolean;
    parameter2Result?: boolean;
    parameter3Result?: boolean;
    parameter4Result?: boolean;
    parameter5Result?: boolean;
    parameter6Result?: boolean;
    parameter7Result?: boolean;
    parameter8Result?: boolean;
    parameter9Result?: boolean;
    assessmentResult?: boolean;
    obs?: string;
    assessmentPhoto0?: string;
    assessmentPhoto1?: string;
    assessmentPhoto2?: string;
    assessmentPhoto3?: string;
    assessmentPhoto4?: string;
    assessmentPhoto5?: string;
    isReassessment: boolean = false;
}