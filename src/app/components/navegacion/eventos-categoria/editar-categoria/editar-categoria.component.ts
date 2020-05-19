import { Component, OnInit } from '@angular/core';

// Formularios
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

// Servicios
import { CategoriaService } from 'src/app/services/categoria.service';
import { UserService } from '../../../../services/user.service';

// Modelo
import { Categoria } from '../../../../models/categoria';

// Notificaciones
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

// rutas
import { ActivatedRoute, Router } from '@angular/router';

// Para autocompletado
interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-editar-categoria',
  templateUrl: './editar-categoria.component.html',
  styleUrls: ['./editar-categoria.component.css']
})
export class EditarCategoriaComponent implements OnInit {

  // Atributos de la clase

  // Formularios
  public formulario: FormGroup;
  // Fin formularios

  // Token del localstorage
  public token: object;

  // Modelo
  public category: Categoria;

  // Captura el id de la categoria
  public idCategoria: number;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private userServices: UserService,
    private toaster: ToastrService, private route: ActivatedRoute, private router: Router) {
    this.category = new Categoria(0, '', '', 0);
    this.crearFormulario();
    this.token = this.userServices.getToken();
    Window["myComponent"] = this;
  }

  ngOnInit(): void {
    this.iconPicker();
    this.showCategoria();
  }


  // **METODOS CRUD**/
  /**
   * onSubmit modificar los datos de categorias
   */
  public onSubmit() {

    const icon: any = document.querySelector('.iconosDavid i').className;
    console.log(icon);

    this.formulario.patchValue({
      icono: icon
    });
    // console.log(this.formulario.value);

    this.category.eventoCategoria = this.formulario.value.categoria;
    this.category.icono = this.formulario.value.icono;

    // console.log(this.category);
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
        this.categoriaService.updateCategoria(this.category, this.token, this.idCategoria).subscribe(
          response => {
            // console.log(response);
            this.toaster.success(response.message);
          },
          error => {
            // console.log(error);
            this.toaster.error(error.error.message);
          }
        );

      }
    });

  }

  /**
   * editarCategoria devuelve un solo invitado
   */
  public showCategoria() {
    // captura del parametro idInvitado
    this.idCategoria = Number(this.route.snapshot.paramMap.get('id'));
    // console.log(this.idPerfil);
    this.categoriaService.showCatergoria(this.idCategoria).subscribe(
      response => {
        console.log(response);
        // Cargando al formulario los datos
        this.formulario.setValue({
          categoria: response.categoria.eventoCategoria,
          icono: response.categoria.icono
        });

      },
      errors => {
        console.log(errors);

      }
    );

  }
  // **FIN METODOS CRUD**/

  // *****FORMULARIOS */

  /**
   * crearFormulario
   */
  public crearFormulario() {
    this.formulario = this.fb.group({
      categoria: ['', Validators.compose([Validators.required])],
      icono: ['', Validators.compose([Validators.required])],
    });
  }

  // validaciones
  get categoria() {
    return this.formulario.get('categoria') as FormArray;
  }
  get icono() {
    return this.formulario.get('icono') as FormArray;
  }

  /**
   * volver a la lista de datos de la categoria
   */
  public volver() {
    // Redireccionamos al componente editarInvitados
    this.router.navigate(['/navegacion/categoria-eventos/listar']);
  }
  // *****FIN FORMULARIOS */


  // jquery
  /**
   * iconPicker
   */
  public iconPicker() {
    // iconos
    $(document).ready(() => {
      $('#icono').iconpicker({
        templates: {
          iconpickerItem: `<a role="button" href="#" class="iconpicker-item" onClick = "Window.myComponent.cargar(event)"><i></i></a>`,
        }
      });

    });

  }

  /**
   * cargar
   */
  public cargar(event) {
    let nameIcon: string;
    if ((event.target as HTMLTextAreaElement).title) {
      nameIcon = ((event.target as HTMLTextAreaElement).title).substring(1);
      console.log(nameIcon);
    } else {
      nameIcon = ((event.target as HTMLTextAreaElement).className).substring(3);
      // console.log(nameIcon);
    }
    this.formulario.patchValue({
      // categoria: [],
      icono: nameIcon
    });
    // console.log(this.formulario.value);

  }
}
