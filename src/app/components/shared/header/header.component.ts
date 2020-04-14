import { Component, OnInit } from '@angular/core';

// Servicios
import { UserService } from '../../../services/user.service';
import { global } from '../../../services/global';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  // providers: [UserService]
})
export class HeaderComponent implements OnInit {
  public identity: any;
  public token: any;
  public url: string;

  constructor(public userServices: UserService) {
    this.identity = this.userServices.getIdentity();
    this.token = this.userServices.getToken();
    this.url = global.url;
  }

  ngOnInit(): void {
    this.fechaIgreso();
  }
  /**
   * fechaIgreso
   */
  public fechaIgreso() {
    const meses: any = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"
      , "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");
    const f = new Date(this.identity.created_at);
    const fecha: string = f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
    // Muestra la fecha en letras
    this.identity.created_at = fecha;
  }
}
