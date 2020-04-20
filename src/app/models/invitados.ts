export class Invitados {
    constructor(
        public id: number,
        public carnet: string,
        public nombres: string,
        public apellidos: string,
        public descripcion: string,
        public estado: number,
        // tslint:disable-next-line: variable-name
        public url_imagen: string,
        // tslint:disable-next-line: variable-name
        public usuarios_id: number
    ) {

    }
}
