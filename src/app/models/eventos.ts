export class Eventos {
    constructor(
        public id: number,
        public nombreEvento: string,
        public fechaEvento: any,
        public horaEvento: any,
        public categoriaId: number,
        public invitadosId: number,
        public usuariosId: number
    ) {

    }
}
