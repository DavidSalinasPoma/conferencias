import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';

// Servicios
import { RegitradosService } from 'src/app/services/regitrados.service';
import { global } from '../../../../services/global';
import { UserService } from '../../../../services/user.service';

// Modelos
import { Registrados } from 'src/app/models/registrados';

// Para las tablas de datos
import { DataTableDirective } from 'angular-datatables';
import { Subject, Observable } from 'rxjs';

// Para direccionar rutas con un boton
import { Router } from '@angular/router';

// Notificaciones
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// Para manejo de fechas
import * as moment from 'moment'; // add this 1 of 4
moment.locale('es');

// Para autocompletado de los eventos
interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-lista-reserva',
  templateUrl: './lista-reserva.component.html',
  styleUrls: ['./lista-reserva.component.css']
})
export class ListaReservaComponent implements OnInit, OnDestroy {

  // Atributos de la clase
  public listaRegistrados: any;

  // ***** Data tables ****
  @ViewChild(DataTableDirective)
  // Directiva para dataTablet
  public dtElement: DataTableDirective;
  // Configuración del data table
  public dtOptions: DataTables.Settings = {};
  // Disparadores de cambio de datatables
  public dtTrigger: Subject<any> = new Subject();
  // **** Fin Data tables******/

  // Recive la url Global
  public url: string;

  // Token
  public token: object;

  // MomentJS
  public momento: any;
  public isNan: any;

  constructor(
    private registroServices: RegitradosService,
    private chRef: ChangeDetectorRef,
    private userService: UserService, private router: Router, private toaster: ToastrService) {

    // Asigna la url del servicio y lo almacena en una varible global
    this.url = global.url;

    this.token = this.userService.getToken();
    this.momento = moment;
    this.isNan = isNaN;
  }


  ngOnInit(): void {
    this.indexRegistrados();
    this.configDatatables();
  }

  /**
   * indexInvitados Lista todos los registros de los registrados
   */
  public indexRegistrados() {

    this.registroServices.indexRegistro().subscribe(
      response => {
        // console.log(response);
        if (response.status === 'success') {

          this.listaRegistrados = response.registrado;
          // tslint:disable-next-line: prefer-for-of
          for (let index = 0; index < this.listaRegistrados.length; index++) {

            // Primero json a un obejto, luego aobjeto a array
            // const listaPermisos = Object.values(JSON.parse(listSoloPerfil[index].permisos));
            this.listaRegistrados[index].pases_articulos = Object.values(JSON.parse(this.listaRegistrados[index].pases_articulos));
          }
          this.listaRegistrados = this.listaRegistrados.reverse();
          // console.log(this.listaRegistrados);

          // Detecta cambios de referencia entre paginas
          this.chRef.detectChanges(); // Datatables al refrescar no pierde los datos
          // ADD THIS
          this.dtTrigger.next(); // Ingresa nueva linea

        }

      },
      errors => {
        console.log(errors);
      }
    );

  }

  /**
   * indexDelete actualiza la lista despues de la eliminacion
   */
  public indexDelete() {

    this.registroServices.indexRegistro().subscribe(
      response => {
        // console.log(response);
        if (response.status === 'success') {

          this.listaRegistrados = response.registrado;
          // tslint:disable-next-line: prefer-for-of
          for (let index = 0; index < this.listaRegistrados.length; index++) {

            // Primero json a un obejto, luego aobjeto a array
            // const listaPermisos = Object.values(JSON.parse(listSoloPerfil[index].permisos));
            this.listaRegistrados[index].pases_articulos = Object.values(JSON.parse(this.listaRegistrados[index].pases_articulos));
          }
          this.listaRegistrados = this.listaRegistrados.reverse();
          this.rerender();
        }
      },
      errors => {
        console.log(errors);
      }
    );

  }

  /**
   * editInvitados
   */
  public editRegistrado(idRegistrado: number) {
    // Redireccionamos al componente editarInvitados
    this.router.navigate(['/navegacion/registrados/edit', idRegistrado]);
  }


  // **** Metodos de la tabla de datos */

  /**
   * tablaDatatables
   */
  public configDatatables() {
    this.dtOptions = {
      lengthChange: false,
      ordering: true,
      info: true,
      autoWidth: false,
      responsive: true,
      order: [[0, "desc"]],
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
      }
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

  // **** Fin metodos de la tabla de datos */


  // *Metodos del sistema**/

  /**
   * eliminarRegistrado Elimina un registrado
   */
  public eliminarRegistrado(idRegistrado: number) {

    Swal.fire({
      title: 'Estas seguro?',
      text: "No podras revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: 'rgb(224, 224, 224)',
      // cancelButtonColor: '#6c757d',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        // Elimninado el registro
        this.registroServices.destroyRegistro(idRegistrado, this.token).subscribe(
          response => {
            // console.log(response);

            if (response.status === 'success') {

              this.toaster.success(response.message);
              this.indexDelete();

            }
          },
          error => {
            this.toaster.error(error.error.message);
          }
        );


      }
    });

  }

  // *Fin metodos del sistema**/

}
