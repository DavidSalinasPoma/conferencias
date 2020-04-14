import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

// Tabla de datos
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

// Formulario
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

// Modelos
import { Regalos } from '../../../models/regalos';

// Servicios
import { UserService } from '../../../services/user.service';
import { global } from '../../../services/global';

import { RegalosService } from '../../../services/regalos.service';

// Aleetas
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';




// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-regalos',
  templateUrl: './regalos.component.html',
  styleUrls: ['./regalos.component.css']
})
export class RegalosComponent implements OnInit, OnDestroy {
  // Atributos de clase

  // Tabla de datos
  @ViewChild('dataTable', { static: true }) table: ElementRef;
  @ViewChild(DataTableDirective)
  public dtElement: DataTableDirective;
  public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject();

  // Para el formulario reactivo
  public formulario: FormGroup;

  // Traer el token del usuario identificado del localstorage
  public token: any;
  public identity: any;
  public regalosModel: Regalos;
  public global: any;

  // Recoje todos los datos de la base de datos
  public indexDatosRegalos: any;

  // Intercala los de editar y guardar
  public btnEdit: boolean;

  // Recibe el idRegalo
  public regaloId: number;

  // Metodo Constructor
  constructor(
    private fb: FormBuilder,
    private userServices: UserService,
    private regaloServices: RegalosService,
    private toaster: ToastrService, private chRef: ChangeDetectorRef) {
    // Crear Formulario
    this.crearFormulario();
    this.token = this.userServices.getToken();
    this.identity = this.userServices.getIdentity();
    this.regalosModel = new Regalos(0, '', 1, 0);
    this.global = global.url;
    this.btnEdit = true;
  }

  ngOnInit(): void {
    this.indexRegalos();
    this.tablaDatatables();
  }



  /**
   * crearFormulario
   */
  public crearFormulario() {
    // Formulario reactivo
    this.formulario = this.fb.group({
      regalos: ['', Validators.compose([Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$")])]
    });
  }

  /**
   * onSubmit Guarda el nuevo regalo en la base de datos.
   */
  public onSubmit() {

    if (this.btnEdit) { // this.btnEdit=true

      this.regalosModel.nombre = this.formulario.value.regalos;
      // Enviamos los datos del formulario a la base de datos mas el token.
      this.regaloServices.storePerfil(this.regalosModel, this.token).subscribe(
        response => {
          console.log(response);

          if (response.status) {
            this.toaster.success(response.message);
            this.indexRegalosRecargar();
          }
        },
        errors => {
          console.log(errors);
          this.toaster.error(errors.error.message, 'Ya existe un registro con este nombre');
        }
      );

    } else { // this.btnEdit=false
      this.regalosModel.nombre = this.formulario.value.regalos;
      // console.log(this.regalosModel);

      this.regaloServices.updatePerfil(this.regalosModel, this.token, this.regaloId).subscribe(
        response => {
          if (response.status === 'success') {
            Swal.fire({
              title: '¿Estás seguro?',
              text: "Modificar los datos",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#28a745',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, modificar!'
            }).then((result) => {
              if (result.value) {
                // Para guardar el usuario en la base de datos
                this.indexRegalosRecargar();
                this.toaster.success('el regalo.', response.message);

              }
            });
          }

        },
        errors => {
          console.log(errors);

        }
      );
    }

  }

  /**
   * indexRegalos Lista todos los regalos
   */
  public indexRegalos() {
    this.regaloServices.indexRegalos().subscribe(
      response => {
        // console.log(response.regalos);

        if (response.status === 'success') {
          this.indexDatosRegalos = response.regalos;
          // Detecta cambios de referencia entre paginas
          this.chRef.detectChanges();
          // ADD THIS
          this.dtTrigger.next();
        }
      },
      errors => {
        console.log(errors);

      }
    );
  }

  /**
   * indexRegalosRecargar
   */
  public indexRegalosRecargar() {
    this.regaloServices.indexRegalos().subscribe(
      response => {
        // console.log(response.usuarios);

        if (response.status === 'success') {
          this.indexDatosRegalos = (response.regalos).reverse();

          // Detecta cambios de en la tabla
          this.rerender();
        }
      },
      errors => {
        console.log(errors);

      }
    );
  }

  /**
   * editarPerfil Carga los datos al formulario
   */
  public editarRegalos(idRegalos: number) {
    // Recibe el id del regalo
    this.regaloId = idRegalos;
    this.regaloServices.showRegalos(idRegalos).subscribe(
      response => {
        // console.log(response);
        if (response.status === "success") {
          // Cambia el boton
          this.btnEdit = false;
          // Carga los datos al formulario
          this.formulario.setValue({
            regalos: response.regalos.nombre
          });
        }
      },
      errors => {
        // console.log(errors);
        this.toaster.error(errors.error.message);

      }

    );

  }

  /**
   * Cancela la edicion del Regalo
   */
  public cancelEdit() {
    this.formulario.reset();
    this.btnEdit = true;
  }

  public cancelGuardar() {
    this.formulario.reset();
  }
  // Validaciones para el fomulario
  get regalos() {
    return this.formulario.get('regalos') as FormArray;
  }

  // **** TABLA de DATOS*/
  /**
   * Aplicar DataTables
   */
  // public aplicarDataTables() {
  //   this.dataTable = $(this.table.nativeElement);
  //   this.dataTable.dataTable(this.dtOptions); // Inyectamos la configuracion a la tabla de datos
  // }
  /**
   * tablaDatatables
   */
  public tablaDatatables() {
    this.dtOptions = {
      lengthChange: false,
      ordering: true,
      info: true,
      autoWidth: false,
      responsive: true,
      order: [[0, "desc"]], // para ordenar la lista
      // emptyTable: "N",
      // scrollX: true
      // lengthMenu: [5, 10, 10, -1],
      pageLength: 5,
      language: {
        info: "Mostrando la pagina _PAGE_ de _PAGES_",
        infoEmpty: "No hay registros",
        infoFiltered: "(Anterior _MAX_ total Siguiente)",
        search: "Buscar: ",
        paginate: {
          next: 'Siguiente',
          previous: 'Anterior',
          last: 'Ultimo',
          first: 'Primero'
        },
      },
    };
  }

  // Si tiene modificaciones para realizar modificaciones directamente en la misma
  // tabla de datos sin cambiar la página, cree y llame a esta función
  public rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  // **** FIN TABLA de DATOS*/

}
