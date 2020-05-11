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

// Para autocompletado
interface HtmlInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-agregar-categoria',
  templateUrl: './agregar-categoria.component.html',
  styleUrls: ['./agregar-categoria.component.css']
})
export class AgregarCategoriaComponent implements OnInit {
  // Atributos de la clase

  // Formularios
  public formulario: FormGroup;
  // Fin formularios

  // Token del localstorage
  public token: object;

  // Modelo
  public category: Categoria;

  constructor(
    private fb: FormBuilder,
    private categoriaService: CategoriaService,
    private userServices: UserService, private toaster: ToastrService) {
    this.category = new Categoria(0, '', '', 0);
    this.crearFormulario();
    this.token = this.userServices.getToken();
    Window["myComponent"] = this;
  }

  ngOnInit(): void {
    this.iconPicker();

  }


  // **METODOS CRUD**/
  /**
   * name
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

    console.log(this.category);


    this.categoriaService.storeCategoria(this.category, this.token).subscribe(
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
   * refrescar
   */
  public refrescar() {
    this.formulario.reset();
    const icon: any = document.querySelector('.iconosDavid i');
    icon.className = '';

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
    this.formulario.setValue({
      categoria: '',
      icono: nameIcon
    });
    // console.log(this.formulario.value);

  }
}
