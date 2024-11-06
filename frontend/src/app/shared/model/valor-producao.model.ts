import { AvaliacaoModel } from "../../avaliacao/model/avaliacao.model";
import { ServicoModel } from "../../servico/model/servico.model";
import { UsuarioModel } from "../../usuario/model/usuario.model";

export class ValorProducaoModel {
    id?: number = 0;
    value: number = 0.0;
    date: Date = new Date();
    user: UsuarioModel = new UsuarioModel();
    task: ServicoModel = new ServicoModel();
    assessment: AvaliacaoModel = new AvaliacaoModel();
    assessmentPercentage: number = 0.0;
}