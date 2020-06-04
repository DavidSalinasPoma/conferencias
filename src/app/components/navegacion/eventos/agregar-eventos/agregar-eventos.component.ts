import { Component, OnInit } from '@angular/core';

// Formularios
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

// Servicios
import { CategoriaService } from '../../../../services/categoria.service';
import { InvitadosService } from '../../../../services/invitados.service';
import { EventosService } from '../../../../services/eventos.service';
import { UserService } from 'src/app/services/user.service';

// DatePicker
// import { IMyDpOptions } from 'mydatepicker';

// Cargar de diferentes maneras Bibliotecas javaScript
// 1.- NPM
// import * as timepicker from 'bootstrap-timepicker';
// const timepickers = timepicker;

// 2.- npm i @types/node --save-dev *** "types": ["node"]
// const timePicker = require("../../../../../assets/plugins/timepicker/bootstrap-timePicker.js");

// 3.- en el index:
// declare var timePicker: any;

// Modelos
import { Eventos } from '../../../../models/eventos';

// Notificaciones
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';


// Para autocompletado
interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

// Tres maneras de importar librerias de javaScript
// 1.- NPM
// * importa todo
// as un nombre de variable
// import * as timepicker from 'bootstrap-timepicker';
// const timepickers = timepicker;

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-agregar-eventos',
  templateUrl: './agregar-eventos.component.html',
  styleUrls: ['./agregar-eventos.component.css']
})
export class AgregarEventosComponent implements OnInit {
  // Atributos de clase

  // Datepicker
  // public myDatePickerOptions: IMyDpOptions = {
  //   // other options...
  //   dateFormat: 'yyyy-mm-dd',
  // };

  // Captura todas las categorias e invitados de la base de datos
  public listCategoria: any[] = [];
  public listInvitado: any[] = [];

  // Formularo reactivo
  public formulario: FormGroup;

  // Modelo de datos
  public eventos: Eventos;

  // Token de usuario
  public token: object;

  constructor(
    private fb: FormBuilder,
    private categoriaServices: CategoriaService,
    private invitadoServices: InvitadosService,
    private eventoServices: EventosService,
    private userServices: UserService,
    private toaster: ToastrService
  ) {
    this.eventos = new Eventos(0, '', '', '', 0, 0);
    this.cargarCategoria();
    this.cargarInvitado();
    this.crearFormulario();
    this.token = this.userServices.getToken();
  }

  ngOnInit(): void {
    this.formulario.reset();
    // this.datePicker();
    // this.timePickers();
  }

  // Formulario
  /**
   * crearFormulario
   */
  public crearFormulario() {
    this.formulario = this.fb.group({
      evento: ['', Validators.compose([
        Validators.required,
        Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúñÑ.;,?¿ ]+$"),
        Validators.maxLength(300)
      ])],
      categoria: ['', Validators.compose([
        Validators.required
      ])],
      fecha: ['', Validators.compose([
        Validators.required
      ])],
      hora: ['', Validators.compose([
        Validators.required
      ])],
      invitado: ['', Validators.compose([
        Validators.required
      ])]
    });
  }

  /**
   * refrescarFormulario
   */
  public refrescarFormulario() {
    this.formulario.reset();
  }

  // Fin formulario

  // Metodo insertar en la base de datos
  /**
   * onSubmit
   */
  public onSubmit() {
    // console.log(this.formulario.value);

    // Llenando el modelo de datos eventos
    this.eventos.nombreEvento = this.formulario.value.evento;
    this.eventos.categoria_id = this.formulario.value.categoria;
    this.eventos.fecha_evento = this.formulario.value.fecha;
    this.eventos.hora_evento = this.formulario.value.hora;
    this.eventos.invitados_id = this.formulario.value.invitado;

    // console.log(this.eventos);
    // Peticiones http a la base de datos
    this.eventoServices.storeEvento(this.eventos, this.token).subscribe(
      response => {
        if (response.status === 'success') {
          this.toaster.success(response.message);
          this.refrescarFormulario();
        }
      },
      error => {
        this.toaster.error(error.error.message);
      }
    );


  }

  // Validacion de formulario
  get evento() {
    return this.formulario.get('evento') as FormArray;
  }
  get categoria() {
    return this.formulario.get('categoria') as FormArray;
  }
  get fecha() {
    return this.formulario.get('fecha') as FormArray;
  }
  get hora() {
    return this.formulario.get('hora') as FormArray;
  }
  get invitado() {
    return this.formulario.get('invitado') as FormArray;
  }

  // Cargar las categorias
  public cargarCategoria() {
    let datosCategoria: any;
    this.categoriaServices.indexCategoria().subscribe(
      response => {
        const perfil = Object.values(response);
        datosCategoria = perfil[2];
        // console.log(datosCategoria);
        for (const item of datosCategoria) {
          this.listCategoria.push({ value: item.id, label: item.eventoCategoria });
        }
        // this.listCategoria = Object.values(this.listCategoria);
        const dato = Object.assign({}, this.listCategoria);
        // console.log(dato);
        this.listCategoria = Object.values(dato);
        // console.log(this.listCategoria);

      },
      errors => {
        console.log(errors);
      }
    );
  }

  // Cargar las categorias
  public cargarInvitado() {
    let datosInvitado: any;
    this.invitadoServices.indexInvitados().subscribe(
      response => {
        const perfil = Object.values(response);
        datosInvitado = perfil[2];
        // console.log(datosInvitado);
        for (const item of datosInvitado) {
          this.listInvitado.push({ value: item.id, label: item.nombres });
        }
        // this.listCategoria = Object.values(this.listCategoria);
        const dato = Object.assign({}, this.listInvitado);
        // console.log(dato);
        this.listInvitado = Object.values(dato);
        // console.log(this.listCategoria);
      },
      errors => {
        console.log(errors);
      }
    );
  }


  // jquery
  /**
   * datePicker
   */
  public datePicker() {

    $('#datepicker').datepicker({
      autoclose: true
    });

  }

  /**
   * timePicker
   */
  public timePickers() {
    // Timepicker
    $('#timepicker').timepicker();
  }

}
