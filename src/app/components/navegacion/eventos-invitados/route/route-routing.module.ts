/***RUTAS DEL COMPONENTE INVITADOS */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes de usuario
import { AgregarInvitadosComponent } from '../agregar-invitados/agregar-invitados.component';
import { ListaInvitadosComponent } from '../lista-invitados/lista-invitados.component';
import { EditarInvitadosComponent } from '../editar-invitados/editar-invitados.component';


export const invitadosRoutes: Routes = [
  { path: 'agregar', component: AgregarInvitadosComponent },
  { path: 'listar', component: ListaInvitadosComponent },
  { path: 'editar/:id', component: EditarInvitadosComponent }
];

