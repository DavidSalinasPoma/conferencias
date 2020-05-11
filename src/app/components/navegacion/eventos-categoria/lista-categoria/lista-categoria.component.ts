import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';

// Servicios
import { CategoriaService } from 'src/app/services/categoria.service';
import { global } from '../../../../services/global';
import { UserService } from '../../../../services/user.service';



// Modelos
import { Categoria } from 'src/app/models/categoria';

// Para las tablas de datos
import { DataTableDirective } from 'angular-datatables';
import { Subject, Observable } from 'rxjs';

// Para direccionar rutas con un boton
import { Router } from '@angular/router';

// Notificaciones
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// Para autocompletado de los eventos
interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;



@Component({
  selector: 'app-lista-categoria',
  templateUrl: './lista-categoria.component.html',
  styleUrls: ['./lista-categoria.component.css']
})
export class ListaCategoriaComponent implements OnInit, OnDestroy {

  // Atributos de la clase
  // public listaInvitados: Invitados;
  public listaCategoria: Categoria;

  // ***** Data tables ****
  public listaUsuarios: any;
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

  constructor(
    private categoriaServices: CategoriaService,
    private chRef: ChangeDetectorRef,
    private router: Router, private toaster: ToastrService, private userService: UserService) {

    // Asigna la url del servicio y lo almacena en una varible global
    this.url = global.url;

    this.token = this.userService.getToken();
  }


  ngOnInit(): void {
    this.indexCategorias();
    this.configDatatables();
  }

  /**
   * indexInvitados Lista todos los registros de invitados
   */
  public indexCategorias() {

    this.categoriaServices.indexCategoria().subscribe(
      response => {
        // console.log(response);
        if (response.status === 'success') {

          this.listaCategoria = response.categoria;
          // console.log(this.listaInvitados);
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
   * indexInvitados Lista todos los registros de invitados
   */
  public indexCategorias2() {

    this.categoriaServices.indexCategoria().subscribe(
      response => {
        // console.log(response);
        if (response.status === 'success') {

          this.listaCategoria = response.categoria;
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
  public editCatergoria(idInvitados: number) {
    // Redireccionamos al componente editarInvitados
    this.router.navigate(['/navegacion/categoria-eventos/editar', idInvitados]);
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
   * eliminarInvitado Elimina si no esta registrado en ningun evento
   */
  public eliminarCategoria(idCategoria: number) {

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
        this.categoriaServices.destroyCategoria(idCategoria, this.token).subscribe(
          response => {
            // console.log(response);

            if (response.status === 'success') {

              this.toaster.success(response.message);
              this.indexCategorias2();

            }
          },
          error => {
            this.toaster.error(error.error.message2, error.error.message);
          }
        );


      }
    });

  }

  // *Fin metodos del sistema**/

}
