export class Categoria {
    constructor(
        public id: number,
        public eventoCategoria: string,
        public icono: string,
        // tslint:disable-next-line: variable-name
        public usuarios_id: number
    ) {

    }
}
