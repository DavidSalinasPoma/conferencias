import { Component, OnInit } from '@angular/core';

// Modelos
import { User } from 'src/app/models/user';

// Servicios
import { UserService } from '../../services/user.service';

// Formularios
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

// Notificaciones
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';




// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  // Atributos de la clase
  public user: User;
  // Formulario Reactivos
  public formulario: any;
  // Datos del Usuario del localStorage
  public tokenUsuario;
  public identify;

  // Metodo constructor de la clase
  constructor(private usersSevice: UserService, private formBuilder: FormBuilder, private toastr: ToastrService, private router: Router) {
    // Creacion del objeto User
    this.user = new User(1, '6406766', '', '', '', '', '', 0, 1);
    // Inicialicacion del objeto usuarioFormulario
    this.formulario = formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9.!#$%&' * +/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")]],
      password: ['', Validators.required]
    });

  }

  ngOnInit(): void {
    this.checkRecordar();

  }

  // Metodos del sistema
  // Recoger datos del formulario
  public onSubmit() {
    this.user.email = this.formulario.value.email;
    this.user.password = this.formulario.value.password;

    // Recibimos lo que llega de laravel
    this.usersSevice.signUp(this.user, null).subscribe(
      response => {
        // Reciviendo datos del Laravel
        this.tokenUsuario = response;

        this.usersSevice.signUp(this.user, true).subscribe(
          responseDatos => {
            this.identify = responseDatos;
            if (this.identify.status !== 'error') {

              // this.toastr.success('Inicio de sesión de usuario!', 'Login correcto');
              // console.log(this.tokenUsuario);
              // console.log(this.identify);
              localStorage.setItem('tokenUsuario', JSON.stringify(this.tokenUsuario));
              localStorage.setItem('identify', JSON.stringify(this.identify));
              // `${this.identify.nombres} ${this.identify.apellidos}`,

              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Login correcto',
                html: `<small>Bienvenid@s ${this.identify.nombres} ${this.identify.apellidos}</small>`,
                showConfirmButton: false,
                timer: 2000
              });

              setTimeout(() => {
                this.router.navigate(['/navegacion/dashboard']);
              }, 2000);

            } else {
              this.toastr.error(`${this.identify.message}`, 'Ingrese datos correctos.');
              console.log(this.tokenUsuario);
              console.log(this.identify);
            }

          },
          error => {
            console.log('error en los datos');

          }
        );
      },
      error => {
        console.log('Error en el token');

      }
    );
  }
  /**
   * checkRecordar
   */
  public checkRecordar() {
    $(document).ready(() => {
      $('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
        increaseArea: '20%' /* optional */
      });
    });
  }

}
