import { Component, OnInit, OnChanges } from '@angular/core';

// La url global de Php laravel
import { global } from '../../../services/global';

// Servicios
import { UserService } from '../../../services/user.service';



// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-asside',
  templateUrl: './asside.component.html',
  styleUrls: ['./asside.component.css']
})
export class AssideComponent implements OnInit {

  public url: string;
  public identity: any;

  constructor(private userServices: UserService) {
    this.url = global.url;
    this.identity = this.userServices.getIdentity();
  }

  ngOnInit(): void {
    this.actualizarSidebar();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnChanges(): void {
    // this.actualizarSidebar();
  }
  /**
   * actualizarSidebar
   */
  public actualizarSidebar() {

    $(document).ready(() => {
      $('.sidebar-menu').tree();
    });
  }

}
