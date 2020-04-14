export class Registrados {
    constructor(
        public id: number,
        public nombres: string,
        public apellidos: string,
        public email: string,
        public pasesArticulos: string,
        public eventosRegistrados: string,
        public regalosId: number,
        public estado: number,
        public totalPagado: number,
        public usuariosId: number,
    ) {

    }
}
