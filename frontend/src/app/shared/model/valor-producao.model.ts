import { AvaliacaoModel } from "src/app/avaliacao/model/avaliacao.model";
import { ServicoModel } from "src/app/servico/model/servico.model";
import { UsuarioModel } from "src/app/usuario/model/usuario.model";

export class ValorProducaoModel {
    id?: number;
    value: number = 0.0;
    date: Date = new Date();
    user: UsuarioModel = new UsuarioModel();
    task: ServicoModel = new ServicoModel();
    assessment: AvaliacaoModel = new AvaliacaoModel();
    assessmentPercentage: number = 0.0;
}