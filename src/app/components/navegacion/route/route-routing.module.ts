
/***RUTAS DEL COMPONENTE NAVEGACION */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Ruta hija de usuarios
import { usuariosRoutes } from '../usuarios/route/route-routing.module';
import { eventosRoutes } from '../eventos/route/route-routing.module';
import { invitadosRoutes } from '../eventos-invitados/route/route-routing.module';


// Componentes de usuario
import { DashboardComponent } from '../dashboard/dashboard.component';
import { UsuariosComponent } from '../usuarios/usuarios.component';
import { EventosComponent } from '../eventos/eventos.component';
import { RegalosComponent } from '../regalos/regalos.component';
import { EventosInvitadosComponent } from '../eventos-invitados/eventos-invitados.component';
import { EventosCategoriaComponent } from '../eventos-categoria/eventos-categoria.component';
import { categoriaRoutes } from '../eventos-categoria/router/route-routing.module';



export const navegacionRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'regalos', component: RegalosComponent },
  { path: 'usuarios', component: UsuariosComponent, children: usuariosRoutes },
  { path: 'eventos', component: EventosComponent, children: eventosRoutes },
  { path: 'invitados', component: EventosInvitadosComponent, children: invitadosRoutes },
  { path: 'categoria-eventos', component: EventosCategoriaComponent, children: categoriaRoutes },
];
