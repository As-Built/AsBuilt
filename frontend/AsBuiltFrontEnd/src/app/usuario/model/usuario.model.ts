export class UsuarioModel {
    public idUsuario: number = 0;
    public username: string = "";
    public senha: string = "";
    public tipoUsuario: number = 0;
    public nome: string = "";
    public dataNascimento: Date = new Date();
    public cpf: string = "";
    public enderecoResidencial: string = "";
    public telefone: string = "";
    public email: string = "";
    public contratante: string = "";
    public dataAdmissao: Date = new Date();
    public dataDesligamento: any;
    public cargo: string = "";
    public remuneracao: number = 0;
}