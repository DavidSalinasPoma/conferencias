export class Regalos {
    constructor(
        public id: number,
        public nombre: string,
        public estado: number,
        // tslint:disable-next-line: variable-name
        public usuarios_id: number
    ) {

    }
}
