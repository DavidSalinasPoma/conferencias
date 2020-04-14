export class User {
    constructor(
        public id: number,
        public carnet: string,
        public nombres: string,
        public apellidos: string,
        public imagen: string,
        public email: string,
        public password: string,
        public estado: number,
        // tslint:disable-next-line: variable-name
        public perfil_id: number
    ) {

    }
}
