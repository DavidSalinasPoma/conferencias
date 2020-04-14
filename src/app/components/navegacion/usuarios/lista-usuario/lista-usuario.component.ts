import { Component, OnInit, ViewChild, OnDestroy, ChangeDetectorRef, ViewEncapsulation, ElementRef, TemplateRef } from '@angular/core';

// Formularios
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { passwordValidation } from 'src/app/validations/password-validation.directive';

// Para las tablas de datos
import { DataTableDirective } from 'angular-datatables';
import { Subject, Observable } from 'rxjs';

// Servicios
import { UserService } from '../../../../services/user.service';
// Importar url global
import { global } from '../../../../services/global';

// Modelo Usuarios
import { User } from '../../../../models/user';

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


// Modales
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-lista-usuario',
  templateUrl: './lista-usuario.component.html',
  // encapsulation: ViewEncapsulation.None,
  styleUrls: ['./lista-usuario.component.css']
})
export class ListaUsuarioComponent implements OnInit, OnDestroy {

  // ***** FORMULARIO*/
  // atributos de clase
  public formulario: FormGroup;
  public user: User;
  public perfiles: any[] = [];
  public token: any;
  // Aqui guarda la imagen.
  public file: File;
  // Es para mostrar la foto que le usuario ha subido.
  public photoSelected: ArrayBuffer | string;
  // Tamaño imagen
  public tamImage: boolean;
  // para editImagen
  public editImagen: string;
  // Para editar usuarios
  public userEditar: any;
  // ** FIN FORMULRIO */

  // Para el modal
  @ViewChild(TemplateRef, { static: false }) myModal: TemplateRef<any>;


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

  public url: string;

  constructor(
    private userServices: UserService,
    private toaster: ToastrService,
    private chRef: ChangeDetectorRef, private modalService: NgxSmartModalService,
    private fb: FormBuilder) {
    this.url = global.url;
    // this.cargarPerfil();
    this.user = new User(0, '', '', '', '', '', '', 1, 0);
    this.crearFormulario();
    // saca el token del local storage
    this.token = this.userServices.getToken();
  }

  ngOnInit(): void {
    // ***** Data tables ****
    this.tablaDatatables();
    this.getListaUsuarios();
    // **** Fin Data tables******/

    // ** INICIO FORMULARIO EDITAR */
    // this.formulario.reset();
    // this.selected();
    // ** INICIO FORMULARIO EDITAR */
  }

  // ** INICIO FORMULARIO EDITAR */
  /**
   * crearFormulario
   */
  public crearFormulario() {
    this.formulario = this.fb.group({
      carnet: ['', [Validators.required, Validators.maxLength(12)]],
      nombres: [
        '',
        Validators.compose([Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$"),
        Validators.maxLength(50),
        Validators.required
        ]),
      ],
      apellidos: [
        '',
        Validators.compose([Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$"),
        Validators.maxLength(50),
        Validators.required
        ]),
      ],
      perfil: ['', Validators.required],
      // tslint:disable-next-line: max-line-length
      email: ['', Validators.compose([Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&' * +/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")])],
      // Es validador sincrono
      // password: ['', Validators.compose([Validators.required, Validators.minLength(8),
      // passwordValidation()])], // para muchas validaciones
      imagen: ['']
    });
  }

  /**
   * onSubmit
   */
  public onSubmit() {


    // console.log(this.formulario.value);

    this.user.carnet = this.formulario.value.carnet;
    this.user.nombres = this.formulario.value.nombres;
    this.user.apellidos = this.formulario.value.apellidos;
    this.user.email = this.formulario.value.email;
    this.user.password = this.formulario.value.password;
    this.user.perfil_id = this.formulario.value.perfil;
    this.user.imagen = '';


    // Recuperar el nombre de la foto
    if (this.file) { // si tiene contenido.
      this.userServices.recuperarPhoto(this.file, this.token).subscribe(
        response => {
          // console.log(response);
          if (response.status === 'success') {
            this.user.imagen = response.image;
            // Para guardar el usuario en la base de datos
            this.añadirUsuario(this.user);
          }
        },
        errors => {
          // En caso que no se un formato valido nececita formateo la imagen en algun editor.
          this.toaster.error(errors.error.message, ' No se guardo el registro!.');
        }
      );

    } else { // en caso de que no se haya selecionado ninguna imagen.
      this.user.imagen = '1586142408no-image.png';
      // Para guardar el usuario en la base de datos
      this.añadirUsuario(this.user);
    }

    // console.log(this.user);

  }

  /**
   * refrescar
   */
  public refrescar() {
    // Para cambios en el formulario
    // this.formulario.patchValue({
    //   carnet: '',
    //   nombres: '',
    //   apellidos: '',
    //   email: '',
    //   password: '',
    // });
    this.formulario.reset();
    // Limpia la imagen
    this.photoSelected = null;
    this.editImagen = null;
    this.tamImage = false;
    this.file = null;
  }

  /**
   * añadirUsuario subMetodo
   */
  public añadirUsuario(user: User) {
    this.userServices.registerUsuario(user).subscribe(
      response => {
        if (response.status === "success") {
          // El usuario se ha creado correctamente
          this.toaster.success(response.message);
          console.log(response);
        } else {
          this.toaster.error(response.message);
        }
      },
      errors => {
        // Ya existe un registro igual.
        this.toaster.error(errors.error.message);
      }
    );
  }

  /**
   * cargarPerfil
   */
  public cargarPerfil() {
    let datosPerfil: any;
    this.perfiles = [];
    this.userServices.getIndexPerfil().subscribe(
      response => {
        const perfil = Object.values(response);
        datosPerfil = perfil[2];
        // console.log(datosPerfil);
        for (const item of datosPerfil) {
          this.perfiles.push({ value: item.id, label: item.nombre });
        }
        // this.perfiles = Object.values(this.perfiles);
        const dato = Object.assign({}, this.perfiles);
        // console.log(dato);
        this.perfiles = Object.values(dato);
        // console.log(this.perfiles);

      },
      errors => {
        console.log(errors);
      }
    );
  }


  /**
   * onPhotoSelected
   */
  public onPhotoSelected(event: HtmlInputEvent) {
    // Sie existe una propiedad Files y si existe.
    // Y tambien que exista un archivo suyo.
    if (event.target.files && event.target.files[0]) {
      // Y si esto es verdad guardarlo
      this.file = event.target.files[0] as File;
      // const fd = new FormData();
      // fd.append('file', this.file);
      // console.log(fd.append);
      this.tamImage = false;
      // console.log(this.file);
      if (this.file.size > 3200000) {
        this.tamImage = true;
      } else {
        // Imagen previa para mostrar
        const reader = new FileReader(); // Esto lee un archivo
        reader.onload = e => {
          this.photoSelected = reader.result;
          // console.log(this.photoSelected);

        };
        // una vez que ha sido leido
        reader.readAsDataURL(this.file);
        this.tamImage = false;
      }

    }

  }

  // Validacion de formulario
  get carnet() {
    return this.formulario.get('carnet');
  }
  // get password() {
  //   return this.formulario.get('password');
  // }
  get nombres() {
    return this.formulario.get('nombres');
  }
  get apellidos() {
    return this.formulario.get('apellidos');
  }
  get email() {
    return this.formulario.get('email');
  }
  get perfil() {
    return this.formulario.get('perfil');
  }
  get imagen() {
    return this.formulario.get('imagen');
  }

  // ** FIN FORMULARIO EDITAR */





  /**
   * getListaUsuarios lista todos los usuarios
   */

  public getListaUsuarios() {
    this.userServices.indexUsuario().subscribe(
      response => {
        if (response.status === "success") {
          this.listaUsuarios = response.usuario;

          // Detecta cambios de referencia entre paginas
          this.chRef.detectChanges(); // Datatables al refrescar no pierde los datos
          // ADD THIS
          this.dtTrigger.next(); // Ingresa nueva linea

        }
        // console.log(this.listaUsuarios);
      },
      errors => {
        this.toaster.error('Servidor caido.');
      }
    );
  }
  public listaEditUser() {
    this.userServices.indexUsuario().subscribe(
      response => {
        if (response.status === "success") {
          this.listaUsuarios = response.usuario;
          // // Detecta cambios de referencia entre paginas
          // this.chRef.detectChanges(); // Datatables al refrescar no pierde los datos
          // // ADD THIS
          // this.dtTrigger.next(); // Ingresa nueva linea
          this.rerender();
        }
        // console.log(this.listaUsuarios);
      },
      errors => {
        this.toaster.error('Servidor caido.');
      }
    );
  }

  /**
   * getOneUser trae solo un dato para la modificación.
   */
  public getEditUsuario(idUser: number, myModal) {

    this.photoSelected = null;
    this.modalService.create('myModal', this.myModal).open();

    this.userServices.showUsuario(idUser).subscribe(
      response => {
        // console.log(response);
        // console.log(response.usuario.carnet);
        // console.log(response.usuario.perfil.id);

        this.userEditar = response;
        this.editImagen = 'Cargando foto...';
        this.editImagen = response.usuario.imagen;
        console.log(this.editImagen);


        this.formulario.reset({
          carnet: response.usuario.carnet,
          nombres: response.usuario.nombres,
          apellidos: response.usuario.apellidos,
          email: response.usuario.email,

        });
        this.cargarPerfil();
        this.perfil.patchValue(response.usuario.perfil.id);
      },
      errors => {
        console.log(errors);
      }
    );

  }

  /**
   * onSubmitEditar manda a editar los usuarios
   */
  public onSubmitEditar() {

    this.user.id = this.userEditar.usuario.id;
    this.user.carnet = this.carnet.value;
    this.user.nombres = this.nombres.value;
    this.user.apellidos = this.apellidos.value;
    // this.user.imagen = this.userEditar.usuario.imagen;
    this.user.email = this.email.value;
    this.user.estado = this.userEditar.usuario.estado;
    this.user.perfil_id = this.perfil.value;
    this.user.imagen = "";


    // Recuperar el nombre de la foto
    if (this.file) { // si tiene file contenido osea foto.
      this.userServices.recuperarPhoto(this.file, this.token).subscribe(
        response => {
          console.log(response);
          if (response.status === 'success') {
            this.user.imagen = response.image;
            console.log(this.user.imagen);
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
                this.editarUsuario(this.user);

              }
            });

          }
        },
        errors => {
          // En caso que no se un formato valido nececita formateo la imagen en algun editor.
          this.toaster.error(errors.error.message, ' No se guardo el registro!.');
        }
      );

    } else { // en caso de que no se haya selecionado ninguna imagen.
      console.log(this.editImagen);

      this.user.imagen = this.editImagen;
      // Para guardar el usuario en la base de datos
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
          this.editarUsuario(this.user);

        }
      });
    }


  }

  /**
   * editarUsuario
   */
  public editarUsuario(user: User) {

    this.userServices.updateUsuario(user, this.token).subscribe(
      response => {
        console.log(response);
        if (response.status === 'Succes') {
          this.toaster.success(response.message);
          this.listaEditUser();
        }

      },
      errors => {
        console.log(errors);
        this.toaster.error(errors.error.message);

      }
    );

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
}
