export class Registrados {
    constructor(
        public id: number,
        public nombres: string,
        public apellidos: string,
        public email: string,
        // tslint:disable-next-line: variable-name
        public pases_articulos: string,
        // tslint:disable-next-line: variable-name
        public regalos_id: number,
        public estado: number,
        // tslint:disable-next-line: variable-name
        public total_pagado: number,
    ) {

    }
}
