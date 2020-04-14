import { Component, OnInit } from '@angular/core';

// Formularios
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

// Modelo
import { Invitados } from 'src/app/models/invitados';

// Para autocompletado para el evento IMAGEN
interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

// Servicios
import { UserService } from '../../../../services/user.service';
import { InvitadosService } from 'src/app/services/invitados.service';


// Notificaciones
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-agregar-invitados',
  templateUrl: './agregar-invitados.component.html',
  styleUrls: ['./agregar-invitados.component.css']
})
export class AgregarInvitadosComponent implements OnInit {
  // Atributos

  // Formulario
  public formulario: FormGroup;

  // Modelo
  public invitados: Invitados;

  // **ATRUBUTOS PARA LA IMAGEN**/
  // Aqui guarda la imagen.
  public file: File;
  // Es para mostrar la foto que le usuario ha subido.
  public photoSelected: ArrayBuffer | string;
  // Tamaño imagen
  public tamImage: boolean;
  // **fin ATRUBUTOS PARA LA IMAGEN**/

  // Recepciona el token del localstorage.
  public token: object;


  constructor(
    private fb: FormBuilder, private toaster: ToastrService,
    private userServices: UserService, private invitadoServices: InvitadosService) {
    this.crearFormulario();
    this.invitados = new Invitados(0, 0, '', '', '', 1, '', 0);
    this.token = this.userServices.getToken();
  }

  ngOnInit(): void {
  }


  // **METODOS PARA CRUD**/

  /**
   * onSubmit
   */
  public onSubmit() {

    // console.log(this.formulario.value);

    this.invitados.carnet = this.formulario.value.carnet;
    this.invitados.nombres = this.formulario.value.nombres;
    this.invitados.apellidos = this.formulario.value.apellidos;
    this.invitados.descripcion = this.formulario.value.descripcion;
    this.invitados.url_imagen = '';

    console.log(this.invitados);

    // Guarda en la base de datos la imagen
    // Luego recupera el nombre de la base de datos la imagen

    if (this.file) {
      this.invitadoServices.recuperarPhoto(this.file, this.token).subscribe(
        response => {
          // console.log(response);
          if (response.status === 'success') {
            this.invitados.url_imagen = response.image;
            // Para guardar el usuario en la base de datos
            this.añadirInvitado(this.invitados);
          }
        },
        errors => {
          // En caso que no se un formato valido nececita formateo la imagen en algun editor.
          this.toaster.error(errors.error.message, ' No se guardo el registro!.');
        }
      );

    } else { // en caso de que no se haya selecionado ninguna imagen.
      this.invitados.url_imagen = '1586142408no-image.png';
      // Para guardar el usuario en la base de datos
      this.añadirInvitado(this.invitados);
    }

    // console.log(this.user);
  }

  /**
   * añadirUsuario subMetodo
   */
  public añadirInvitado(invitados: Invitados) {
    this.invitadoServices.storeInvitados(invitados, this.token).subscribe(
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
        console.log(errors);

        this.toaster.error(errors.error.message);
      }
    );
  }

  // **FIN METODOS PARA CRUD**/


  // **METODOS PARA EL MANEJO DE IMAGENES**/
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

  // **FIN METODOS PARA EL MANEJO DE IMAGENES**/




  // ***FORMULARIOS**/

  /**
   * crearFormulario
   */
  public crearFormulario() {
    this.formulario = this.fb.group({
      carnet: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9-]+$')])],
      nombres: ['', Validators.compose([Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$"),
      Validators.maxLength(50),
      Validators.required
      ])],
      apellidos: ['', Validators.compose([Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$"),
      Validators.maxLength(50),
      Validators.required
      ])],
      descripcion: ['', Validators.compose([Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$"),
      Validators.maxLength(50),
      Validators.required
      ])],
      imagen: ['', Validators.compose([Validators.required])]
    });
  }

  /**
   * refrescarFormulario
   */
  public refrescarFormulario() {
    this.formulario.reset();
  }

  get carnet() {
    return this.formulario.get('carnet') as FormArray;
  }

  get nombres() {
    return this.formulario.get('nombres') as FormArray;
  }

  get apellidos() {
    return this.formulario.get('apellidos') as FormArray;
  }

  get descripcion() {
    return this.formulario.get('descripcion') as FormArray;
  }

  get imagen() {
    return this.formulario.get('imagen') as FormArray;
  }
  // ***FIN FORMULARIO**/

}
