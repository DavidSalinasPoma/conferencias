import { Component, OnInit } from '@angular/core';

// srevicios usuarios
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [UserService]
})
export class DashboardComponent implements OnInit {
  // Atributos de  la clase
  public identity: any;
  public token: any;
  constructor(public userSevices: UserService) {
    // Inicializamos atributos
    this.identity = this.userSevices.getIdentity();
    this.token = this.userSevices.getToken();
  }

  ngOnInit(): void {
  }

}
