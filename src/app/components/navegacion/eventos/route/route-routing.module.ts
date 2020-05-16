
/***RUTAS DEL COMPONENTE EVENTOS */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgregarEventosComponent } from '../agregar-eventos/agregar-eventos.component';
import { ListaEventosComponent } from '../lista-eventos/lista-eventos.component';
import { EditarEventosComponent } from '../editar-eventos/editar-eventos.component';

// Componentes de usuario


export const eventosRoutes: Routes = [
  { path: 'agregar', component: AgregarEventosComponent },
  { path: 'listar', component: ListaEventosComponent },
  { path: 'editar', component: EditarEventosComponent }
];
