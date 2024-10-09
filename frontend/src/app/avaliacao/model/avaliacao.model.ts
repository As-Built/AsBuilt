import { ServicoModel } from "../../servico/model/servico.model";
import { UsuarioModel } from "../../usuario/model/usuario.model";

export class AvaliacaoModel {
    id?: number;
    task: ServicoModel = new ServicoModel();
    taskExecutors: UsuarioModel[] = [];
    taskEvaluators: UsuarioModel[] = [];
    assessmentDate: Date = new Date();
    assessmentParameter0Result?: boolean;
    assessmentParameter1Result?: boolean;
    assessmentParameter2Result?: boolean;
    assessmentParameter3Result?: boolean;
    assessmentParameter4Result?: boolean;
    assessmentParameter5Result?: boolean;
    assessmentParameter6Result?: boolean;
    assessmentParameter7Result?: boolean;
    assessmentParameter8Result?: boolean;
    assessmentParameter9Result?: boolean;
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