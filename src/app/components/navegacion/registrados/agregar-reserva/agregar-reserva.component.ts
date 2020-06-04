import { Component, OnInit } from '@angular/core';

// Formulario
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

// Servicios
import { RegitradosService } from '../../../../services/regitrados.service';
import { RegalosService } from '../../../../services/regalos.service';
import { UserService } from '../../../../services/user.service';


// Modelos
import { Registrados } from '../../../../models/registrados';


// Notificaciones
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-agregar-reserva',
  templateUrl: './agregar-reserva.component.html',
  styleUrls: ['./agregar-reserva.component.css']
})
export class AgregarReservaComponent implements OnInit {
  // Atributos de clase
  /*Formularios */
  public formulario: FormGroup;
  /*Fin formularios */

  // Atributos de la logica de negocio
  public diaViernes: boolean;
  public diaSabado: boolean;
  public diaDomingo: boolean;
  // Guarda los precios de los dias,
  public precioViernes: number;
  public precioSabado: number;
  public precioDomingo: number;
  public precioGeneral: string;
  public precioTotal: string;

  // Mostrar regalo si la venta es mayor a cero
  public mostrarRegalo: boolean;


  // Captura todas las categorias e invitados de la base de datos
  public listRegalos: any[] = [];

  // Modelos
  public modeloRegistro: Registrados;

  // Token del usuario
  public token: object;

  // dias
  public dia: number;


  constructor(
    private fb: FormBuilder,
    private registroService: RegitradosService,
    private regaloServices: RegalosService,
    private toaster: ToastrService,
    private userServices: UserService
  ) {
    this.modeloRegistro = new Registrados(0, '', '', '', '', 0, 0, 0);
    this.cargarRegalos();
    this.crearformulario();
    this.diaViernes = false;
    this.diaSabado = false;
    this.diaDomingo = false;
    this.precioViernes = 0;
    this.precioSabado = 0;
    this.precioDomingo = 0;
    this.precioGeneral = 'Bs. 0.-';
    this.mostrarRegalo = false;
    this.token = this.userServices.getToken();
  }

  ngOnInit(): void {
    this.formulario.reset();
    this.checkRecordar();
  }

  // Metodo que sube los datos a la base de datos
  /**
   * onSubmit
   */
  public onSubmit() {
    // console.log(this.formulario.value);
    this.modeloRegistro.nombres = this.formulario.value.nombres;
    this.modeloRegistro.apellidos = this.formulario.value.apellidos;
    this.modeloRegistro.email = this.formulario.value.email;
    this.modeloRegistro.regalos_id = this.formulario.value.regalo;
    this.modeloRegistro.estado = 1;
    this.modeloRegistro.total_pagado = this.formulario.value.total;
    // console.log(this.modeloRegistro);

    // Peticiones http a la base de datos
    Swal.fire({
      title: 'Compra de un producto',
      text: "Esta apunto de realizar una compra",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Comprar!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.registroService.storeRegistro(this.modeloRegistro, this.token).subscribe(
          resolve => {
            if (resolve.status === 'success') {
              this.toaster.success(resolve.message);
              this.refrescarFormulario();
            }
          },
          error => {
            console.log(error);

            this.toaster.error(error.error.message);
          }
        );

      }
    });
  }

  // Crear formulario
  /**
   * crearformulario  Reactivo
   */
  public crearformulario() {
    this.formulario = this.fb.group({
      nombres: ['', Validators.compose([
        Validators.required, Validators.maxLength(70),
        Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúñÑ.;, ]+$")
      ])],
      apellidos: ['', Validators.compose([
        Validators.required, Validators.maxLength(100),
        Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúñÑ.;, ]+$")
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9.!#$%&' * +/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"),
        Validators.maxLength(100)
      ])],
      regalo: ['', Validators.compose([Validators.required])],
      total: ['', Validators.compose([Validators.required])]
    });
  }

  // Validacion de formularios
  get nombres() {
    return this.formulario.get('nombres') as FormArray;
  }
  get apellidos() {
    return this.formulario.get('apellidos') as FormArray;
  }
  get email() {
    return this.formulario.get('email') as FormArray;
  }
  get regalo() {
    return this.formulario.get('regalo') as FormArray;
  }
  get total() {
    return this.formulario.get('total') as FormArray;
  }

  /**
   * refrescarFormulario
   */
  public refrescarFormulario() {
    this.formulario.reset();
    this.diaViernes = false;
    this.diaSabado = false;
    this.diaDomingo = false;
    this.precioViernes = 0;
    this.precioSabado = 0;
    this.precioDomingo = 0;
    const mostrarResumen = document.querySelector('#resumen');
    mostrarResumen.innerHTML = '';
    this.precioTotal = '';

    const camisa: any = (document.querySelector('#camisa') as HTMLInputElement);
    const paquete: any = (document.querySelector('#paquete') as HTMLInputElement);
    (camisa as HTMLInputElement).value = '0';
    (paquete as HTMLInputElement).value = '0';
    this.mostrarRegalo = false;
  }

  // Cargar las Regalos
  public cargarRegalos() {
    let datosRegalo: any;
    this.regaloServices.indexRegalos().subscribe(
      response => {
        const perfil = Object.values(response);
        datosRegalo = perfil[2];
        // console.log(datosInvitado);
        for (const item of datosRegalo) {
          this.listRegalos.push({ value: item.id, label: item.nombre });
        }
        // console.log(this.listRegalos);

        // this.listCategoria = Object.values(this.listCategoria);
        const dato = Object.assign({}, this.listRegalos);
        // console.log(dato);
        this.listRegalos = Object.values(dato);
        // console.log(this.listCategoria);
      },
      errors => {
        console.log(errors);
      }
    );
  }

  // Logia de negocio
  /**
   * viernes
   */
  public viernes() {
    this.diaViernes = true;
    this.precioViernes = 100;
    this.precioGeneral = 'Viernes - Bs. 100.-';
    this.dia = 1;

    this.diaSabado = false;
    this.diaDomingo = false;
    this.precioSabado = 0;
    this.precioDomingo = 0;
  }
  /**
   * sabado
   */
  public sabado() {
    this.diaSabado = true;
    this.precioSabado = 150;
    this.precioGeneral = 'Viernes y sabado - Bs. 150.-';
    this.dia = 2;
    this.diaViernes = false;
    this.diaDomingo = false;
    this.precioViernes = 0;
    this.precioDomingo = 0;
  }
  /**
   * domingo
   */
  public domingo() {
    this.diaDomingo = true;
    this.precioDomingo = 200;
    this.precioGeneral = 'Tres dias - Bs. 200.-';
    this.dia = 3;

    this.diaViernes = false;
    this.diaSabado = false;
    this.precioViernes = 0;
    this.precioSabado = 0;
  }

  /**
   * calcularPrecio
   */
  public calcularPrecio() {
    let total: number;
    const pasesArticulos: any = [];

    const mostrarResumen = document.querySelector('#resumen');
    const camisa: any = (document.querySelector('#camisa') as HTMLInputElement).value;
    const paquete: any = (document.querySelector('#paquete') as HTMLInputElement).value;


    const camisas = (40 - ((40 * 7) / 100)) * camisa;
    const paquetes = paquete * 10;
    total = camisas + paquetes + this.precioDomingo + this.precioSabado + this.precioViernes;
    this.precioTotal = `Bs. ${total}.-`;

    pasesArticulos.push(`1 Pases: ${this.precioGeneral}`);
    pasesArticulos.push(`${camisa} Polera: Bs. ${camisas.toFixed(2)}.-`);
    pasesArticulos.push(`${paquete} Etiquetas: Bs. ${paquetes}.-`);
    pasesArticulos.push(camisa);
    pasesArticulos.push(paquete);
    pasesArticulos.push(this.dia);

    const resumenHtml = `
    <ul>
        <li style="margin-top: 10px;">1 Pases:<strong> ${this.precioGeneral}</strong></li>
        <li style="margin-top: 10px;"> ${camisa} Polera:<strong> Bs. ${camisas.toFixed(2)}.-</strong> </li>
        <li style="margin-top: 10px;"> ${paquete} Etiquetas:<strong> Bs. ${paquetes}.-</strong></li>
    </ul>
    `;
    mostrarResumen.innerHTML = resumenHtml;
    if (total > 0 && (this.precioDomingo > 0 || this.precioSabado > 0 || this.precioViernes > 0)) {
      this.mostrarRegalo = true;
      this.formulario.patchValue({
        total: total
      });

      this.modeloRegistro.pases_articulos = Object.assign({}, pasesArticulos); // Convertir array a objeto
      // console.log(this.modeloRegistro);

    } else {
      this.toaster.error('Elije un producto del evento');
    }
  }

  /**
   * checkRecordar
   */
  public checkRecordar() {
    $(document).ready(() => {
      $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' /* optional */
      });
    });
  }
}
