export class Invitados {
    constructor(
        public id: number,
        public carnet: number,
        public nombres: string,
        public apellidos: string,
        public descripcion: string,
        public estado: number,
        // tslint:disable-next-line: variable-name
        public url_imagen: string,
        public usuariosId: number
    ) {

    }
}
