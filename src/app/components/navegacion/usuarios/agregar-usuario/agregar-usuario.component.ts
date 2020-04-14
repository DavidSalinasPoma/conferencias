// Angular core
import { Component, OnInit } from '@angular/core';

// Formularios
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { passwordValidation } from 'src/app/validations/password-validation.directive';
import { nombreValidation } from 'src/app/validations/nombre-validation.directive';
import { apellidoValidation } from 'src/app/validations/apellidos-validation.directive';

// Importamos el archivo global
import { global } from '../../../../services/global';
import { UserService } from 'src/app/services/user.service';

// Modelo Usuarios
import { User } from '../../../../models/user';
import { analyzeAndValidateNgModules } from '@angular/compiler';

// Notificaciones
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';




// Para autocompletado
interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-agregar-usuario',
  templateUrl: './agregar-usuario.component.html',
  styleUrls: ['./agregar-usuario.component.css']
})
export class AgregarUsuarioComponent implements OnInit {
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

  ages: any[] = [
    { value: '<18', label: 'Under 18' },
    { value: '18', label: '18' },
    { value: '>18', label: 'More than 18' },
  ];

  constructor(private fb: FormBuilder, private userService: UserService, private toaster: ToastrService) {
    this.cargarPerfil();
    this.user = new User(0, '', '', '', '', '', '', 1, 0);
    this.crearFormulario();
    // saca el token del local storage
    this.token = this.userService.getToken();
  }

  // // Para el manejo de imagenes virctor Robles
  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png, .gif, .jpeg",
    maxSize: "25",
    uploadAPI: {
      url: global.url + 'user/upload',
      headers: {
        Authorization: this.userService.getToken()
      }
    },
    theme: "attachPin",
    hideProgressBar: true,
    hideResetBtn: true,
    hideSelectBtn: true,
    attachPinText: 'Sube tu avatar de usuario!',
    replaceTexts: {
      selectFileBtn: 'Seleccione archivos de imagen',
      resetBtn: 'reiniciar',
      uploadBtn: 'Subir',
      dragNDropBox: 'Arrastrar y soltar',
      attachPinBtn: 'Adjuntar archivos',
      afterUploadMsg_success: 'Cargado correctamente!',
      afterUploadMsg_error: 'La subida de la imagen ha fallado!'
    }
  };

  /**
   * onPhotoSelected Para el manejo de imagenes FAZT CODE
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

  ngOnInit(): void {
    this.formulario.reset();
    this.selected();
  }

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
        ])
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
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), passwordValidation()])], // para muchas validaciones
      imagen: ['']
    });
  }

  /**
   * onSubmit
   */
  public onSubmit() {


    console.log(this.formulario.value);

    this.user.carnet = this.formulario.value.carnet;
    this.user.nombres = this.formulario.value.nombres;
    this.user.apellidos = this.formulario.value.apellidos;
    this.user.email = this.formulario.value.email;
    this.user.password = this.formulario.value.password;
    this.user.perfil_id = this.formulario.value.perfil;
    this.user.imagen = '';


    // Recuperar el nombre de la foto

    if (this.file) {
      this.userService.recuperarPhoto(this.file, this.token).subscribe(
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
   * añadirUsuario subMetodo
   */
  public añadirUsuario(user: User) {
    this.userService.registerUsuario(user).subscribe(
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
    this.tamImage = false;
    this.file = null;
  }

  /**
   * cargarPerfil
   */
  public cargarPerfil() {
    let datosPerfil: any;
    this.userService.getIndexPerfil().subscribe(
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
   * eventos
   */
  public eventos(datos) {
    console.log(datos);

  }

  // Validacion de formulario
  get carnet() {
    return this.formulario.get('carnet');
  }
  get password() {
    return this.formulario.get('password');
  }
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

  // metodo para imagen
  /**
   * avatarUpload DE VICTOR Robles.
   */
  public avatarUpload(datos) {

    console.log(datos.response);
    const data = JSON.parse(datos.response); // convierte de json a un objeto+

    console.log(data.image);

    this.user.imagen = data.image;

  }

  // jquery para select
  /**
   * selected
   */
  public selected() {
    $(document).ready(() => {
      $('.select2').select2({

      });
    });
  }
}
