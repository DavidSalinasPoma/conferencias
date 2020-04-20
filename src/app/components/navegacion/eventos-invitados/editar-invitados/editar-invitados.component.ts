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
import { global } from '../../../../services/global';



// Notificaciones
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// Para direccionar rutas con un boton
import { Router, Route, ActivatedRoute } from '@angular/router';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-editar-invitados',
  templateUrl: './editar-invitados.component.html',
  styleUrls: ['./editar-invitados.component.css']
})
export class EditarInvitadosComponent implements OnInit {
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

  public invitadosEdit: any;
  public editImagen: any;
  public url: string;
  public idInvitados: any;

  constructor(
    private fb: FormBuilder, private toaster: ToastrService,
    private userServices: UserService, private invitadoServices: InvitadosService,
    private route: ActivatedRoute, private router: Router) {
    this.crearFormulario();
    this.invitados = new Invitados(0, '', '', '', '', 1, '', 0);
    this.token = this.userServices.getToken();
    this.url = global.url;
  }

  ngOnInit(): void {
    this.editarInvitados();
  }
  // **METODOS PARA CRUD**/
  /**
   * onSubmit
   */
  public onSubmitEdit() {

    // console.log(this.formulario.value);

    this.invitados.carnet = this.formulario.value.carnet;
    this.invitados.nombres = this.formulario.value.nombres;
    this.invitados.apellidos = this.formulario.value.apellidos;
    this.invitados.descripcion = this.formulario.value.descripcion;

    //  Validacion imagen1
    if (this.formulario.value.imagen === null) {

      this.invitados.url_imagen = this.editImagen;

      Swal.fire({
        title: 'Estas seguro?',
        text: "Esta apunto de modificar un registro.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Modifiacar!',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          this.invitadoServices.updateInvitados(this.invitados, this.token, this.idInvitados).subscribe(
            response => {
              // console.log(response);
              if (response.status === 'success') {
                this.toaster.success(response.message);
              }
            },
            error => {
              this.toaster.error(error.error.message);
            }
          );
        }
      });

    } else {
      // this.invitados.url_imagen = this.formulario.value.imagen;

      Swal.fire({
        title: 'Estas seguro?',
        text: "Esta apunto de modificar un registro.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Modifiacar!',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      }).then((result) => {
        if (result.value) {
          // Guarada y muestra el nombre de la foto
          this.invitadoServices.recuperarPhoto(this.file, this.token).subscribe(
            response => {
              if (response.status === 'success') {

                // guarda el nombre del la foto
                this.invitados.url_imagen = response.image;
                // Guarda la modificaciond del registro
                this.invitadoServices.updateInvitados(this.invitados, this.token, this.idInvitados).subscribe(
                  respuesta => {
                    // console.log(respuesta);
                    if (respuesta.status === 'success') {
                      this.toaster.success(respuesta.message);

                      // Elimina la anterior fotografia del invitado
                      // console.log(this.editImagen);

                      this.invitadoServices.destroyImagen(this.editImagen).subscribe();
                      this.editImagen = response.image;
                    }
                  },
                  error => {
                    this.toaster.error(error.error.message);
                  }
                );
              }
            },
            error => {
              this.toaster.error(error.error.message);
            }
          );
        }
      });

    }

  }

  /**
   * editarInvitados devuelve un solo invitado
   */
  public editarInvitados() {
    // captura del parametro idInvitado
    this.idInvitados = this.route.snapshot.paramMap.get('id');
    // console.log(this.idPerfil);
    this.invitadoServices.showInvitados(this.idInvitados).subscribe(
      response => {
        // console.log(response);

        this.invitadosEdit = response.invitados;
        this.editImagen = 'Cargando foto...';
        this.editImagen = response.invitados.url_imagen;
        // console.log(this.editImagen);


        this.formulario.reset({
          carnet: response.invitados.carnet,
          nombres: response.invitados.nombres,
          apellidos: response.invitados.apellidos,
          descripcion: response.invitados.descripcion,

        });
      },
      errors => {
        console.log(errors);

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
      descripcion: ['', Validators.compose([Validators.pattern("^[A-Za-zÁÉÍÓÚáéíóúñÑ.;, ]+$"),
      Validators.maxLength(500),
      Validators.required
      ])],
      imagen: ['']
    });
  }

  /**
   * refrescarFormulario
   */
  public cancelarEdicion() {
    // Redireccionamos al componente Lista de invitdos
    this.router.navigate(['/navegacion/invitados/listar']);
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
