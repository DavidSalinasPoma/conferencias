import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, QueryList, ElementRef, ViewChildren } from '@angular/core';

// Servicios
import { UserService } from '../../../../services/user.service';

// Para las tablas de datos
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';

// Formularios
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

// Modelo de datos
import { Perfil } from 'src/app/models/perfil';

// Notificaciones
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// Para manejo de arrays
import * as _ from 'lodash';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

// Interfaces
export interface Permisos {
  name: string;
  value: string;
  selected: boolean;
}
// Interfaces
export interface PasaTiempo {
  name: string;
  value: string;
}

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css'],
  providers: [UserService]
})
export class PerfilUsuarioComponent implements OnInit, OnDestroy {
  // Atributos de  clase
  public listaPerfil: any;
  // Formulario Reactivos
  public formPerfil: FormGroup; // lo utilizaremos de prueba

  public permiso: Permisos[];
  public permiso2: Permisos[];
  /** Ejemplo */
  public selectedTiemposNames: Array<any> = [];
  /** Fin ejemplo */

  public perfil: Perfil;
  public token: any;
  // Estado que cambia el boton de guaradar a editar.
  public stadoEdit: boolean;

  // Obtiene el perfil ID
  public perfilId: number;


  @ViewChildren("checkboxes") checkboxes: QueryList<ElementRef>;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(
    public userService: UserService,
    public formBuilder: FormBuilder,
    private toaster: ToastrService,
    private chRef: ChangeDetectorRef) {
    this.permiso2 = [ // esto mostrara en la vista
      { name: 'Administrador', value: 'administrador', selected: false },
      { name: 'Ventas ticket', value: 'ventas ticket', selected: false }
    ];
    localStorage.setItem('permiso', (JSON.stringify(this.permiso2)).toString());
    this.permiso = JSON.parse(localStorage.getItem("permiso"));

    this.perfil = new Perfil(0, '', '');
    // Inicialicacion del objeto perfilFormulario
    this.formPerfil = this.formBuilder.group({
      perfil: [''],
      // checkArray: this.formBuilder.array([]),
      /** Ejemplo */
      hobbies: this.createHobbies(this.permiso)
      /** Fin Ejemplo */


    });
    this.getSelectedHobbies();
    this.token = this.userService.getToken();
    this.stadoEdit = true;

  }

  ngOnInit(): void {
    this.tablaDatatables();
    this.getPerfilInicio();
    this.checkItem();
  }

  /****EJEMPLO */
  createFormInputs() {
    // this.personForm = new FormGroup({
    //   hobbies: this.createHobbies(this.myhobbies),
    // });
    // this.getSelectedHobbies();
  }
  public createHobbies(hobbiesInputs) {
    const arr = hobbiesInputs.map(hobby => {
      return new FormControl(hobby.selected || false, Validators.required);
    });
    return new FormArray(arr, Validators.required);
  }
  getSelectedHobbies() {
    this.selectedTiemposNames = _.map(
      this.formData.controls,
      (hobby, i) => {
        return hobby.value && this.permiso[i].value;
      }
    );
    this.getSelectedHobbiesName();
  }

  // Muestra los datos en pantalla en tiempo real
  getSelectedHobbiesName() {
    this.selectedTiemposNames = _.filter(
      this.selectedTiemposNames,
      (hobby) => {
        if (hobby !== false) {
          return hobby;
        }
      }
    );
    // console.log(this.selectedTiemposNames);

  }

  get formData() {
    return this.formPerfil.get('hobbies') as FormArray;
  }

  /****FIN EJEMPLO */

  /**
   * onSubmit
   */
  public onSubmit() {

    if (this.stadoEdit === true) {
      this.perfil.nombre = this.formPerfil.value.perfil;

      // this.perfil.permisos = Object.assign({}, this.formPerfil.value.checkArray); // Convertir array a objeto
      this.perfil.permisos = Object.assign({}, this.selectedTiemposNames); // Convertir array a objeto

      console.log(this.perfil);


      /** Para borrar los checkBox y comenzar desde cero */
      // limpiando datos
      // const checkArray: FormArray = this.formPerfil.get('hobbies') as FormArray;
      // checkArray.clear();

      this.userService.getStorePerfil(this.perfil, this.token).subscribe(
        response => {

          if (response.status === 'success') {
            this.toaster.success(`${response.message}`);
            // Recarga el dataTable perfil en angular
            this.getPerfilRecargar();
            this.formPerfil.reset();

          } else {

            this.toaster.error(` ${response.message}, ${response.code} `);
          }

        },
        errores => {
          // this.uncheckAll(); // Limpia los checkbox
          // Alerta el perfil de usuario ya existe
          this.toaster.error(` ${errores.error.message}`);
        }
      );
    } else { // Para editar.

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
          this.perfil.nombre = this.formPerfil.value.perfil;
          // this.perfil.permisos = Object.assign({}, this.formPerfil.value.checkArray); // Convertir array a objeto
          this.perfil.permisos = Object.assign({}, this.selectedTiemposNames); // Convertir array a objeto
          console.log(this.perfil);

          this.userService.getUpdatePerfil(this.perfil, this.token, this.perfilId).subscribe(
            response => {
              console.log(response);
              if (response.status === 'success') {
                this.toaster.success('Los datos se ha actualizado correctamente');
                // Recarga el dataTable perfil en angular
                this.getPerfilRecargar();
                this.formPerfil.reset();
              } else {
                this.toaster.error('Error en la actualización de datos.');
              }
            },
            errores => {
              // Llene todos los campos
              this.toaster.error(errores.error.message);
            }
          );
        }
      });

    }
  }

  /**
   * editarPerfil
   */
  public editarPerfil(idPerfil: number) {
    this.perfilId = idPerfil;
    // Conseguir elemento
    // localStorage.getItem("permiso");
    // console.log(this.permiso);
    // console.log(JSON.parse(localStorage.getItem("permiso")));

    this.userService.getShowPerfil(idPerfil).subscribe(
      response => {

        const perfilEdit: any = response;

        if (perfilEdit.status === 'success') {

          // console.log(this.permiso);
          // console.log(JSON.parse(localStorage.getItem("permiso")));

          const datosPermiso = JSON.parse(localStorage.getItem("permiso"));
          // Convierte un JSON a OBJETO y >OBJETO a ARRAY
          const datos = Object.values(JSON.parse(perfilEdit.perfil.permisos));

          for (const item of datosPermiso) {
            for (const dato of datos) {
              if (item.value === dato) {
                item.selected = true;
              }
            }
          }
          // console.log(datosPermiso);


          // }
          // cargar datos en el formulario
          // this.formulario.setValue({
          // this.formPerfil.reset({// No pide todos los valores para mostrar en el formulario
          //   perfil: perfilEdit.perfil.nombre,
          //   hobbies: this.createHobbies(datosPermiso)
          // });
          this.formPerfil = this.formBuilder.group({
            perfil: [perfilEdit.perfil.nombre],
            // checkArray: this.formBuilder.array([]),
            /** Ejemplo */
            hobbies: this.createHobbies(datosPermiso)
            /** Fin Ejemplo */
          });
          this.stadoEdit = false;
          this.getSelectedHobbies();
        }
      },
      error => {
        console.log(error);
      }
    );

  }
  public cancelEdit() {
    this.formPerfil.reset();
    this.uncheckAll();
    this.stadoEdit = true;
  }

  /** LISTAR DATOS DEL PERFIL DEL EVENTO */
  public getPerfilInicio() {

    let listPerfilLocal: any;
    let listSoloPerfil: any;
    const datosPermisos: any[] = [];
    this.userService.getIndexPerfil().subscribe(
      response => {
        listPerfilLocal = response;
        if (listPerfilLocal.status === 'success') {

          listSoloPerfil = listPerfilLocal.perfil;

          // console.log(listSoloPerfil);

          // tslint:disable-next-line: prefer-for-of
          for (let index = 0; index < listSoloPerfil.length; index++) {

            // Primero json a un obejto, luego aobjeto a array
            const listaPermisos = Object.values(JSON.parse(listSoloPerfil[index].permisos));
            listSoloPerfil[index].permisos = Object.values(JSON.parse(listSoloPerfil[index].permisos));
          }

          this.listaPerfil = listSoloPerfil.reverse();

          // console.log(this.listaPerfil);

          // Detecta cambios de referencia entre paginas
          this.chRef.detectChanges();
          // ADD THIS
          this.dtTrigger.next();
        }
      },
      error => {

        console.log(error);
      }
    );
  }

  /**
   * getPerfilRecargar
   */
  public getPerfilRecargar() {

    let listPerfilLocal: any;
    let listSoloPerfil: any;
    const datosPermisos: any[] = [];
    this.userService.getIndexPerfil().subscribe(
      response => {
        listPerfilLocal = response;
        if (listPerfilLocal.status === 'success') {

          listSoloPerfil = listPerfilLocal.perfil;

          // tslint:disable-next-line: prefer-for-of
          for (let index = 0; index < listSoloPerfil.length; index++) {

            // Primero json a un obejto, luego aobjeto a array
            // const listaPermisos = Object.values(JSON.parse(listSoloPerfil[index].permisos));
            listSoloPerfil[index].permisos = Object.values(JSON.parse(listSoloPerfil[index].permisos));
          }
          // Carga de la nueva lista
          this.listaPerfil = null;
          this.listaPerfil = listSoloPerfil.reverse();

          this.formPerfil.reset();
          this.rerender();
          this.uncheckAll();
        }
      },
      error => {
        console.log(error);
      }
    );

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

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
  /**
   * checkItem
   */
  public checkItem() {
    // Flat red color scheme for iCheck
    $('input[type="checkbox"].flat-red, input[type="radio"].flat-red').iCheck({
      checkboxClass: 'icheckbox_flat-green',
      radioClass: 'iradio_flat-green'
    });
  }

  // CheckBox
  onCheckboxChange(e) {
    const checkArray: FormArray = this.formPerfil.get('checkArray') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: any = 0;
      checkArray.controls.forEach((item: FormControl) => {
        if (item.value === e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  // Borrar check recupera del viwchildrem
  public uncheckAll() {
    this.checkboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }
}
