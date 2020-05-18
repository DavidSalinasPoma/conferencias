
export class Eventos {
    constructor(
        public id: number,
        public nombreEvento: string,
        // tslint:disable-next-line: variable-name
        public fecha_evento: any,
        // tslint:disable-next-line: variable-name
        public hora_evento: any,
        // tslint:disable-next-line: variable-name
        public categoria_id: number,
        // tslint:disable-next-line: variable-name
        public invitados_id: number,

    ) {

    }
}
