/***RUTAS DEL modulo registrados */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes de usuario
import { AgregarReservaComponent } from '../agregar-reserva/agregar-reserva.component';
import { EditarReservaComponent } from '../editar-reserva/editar-reserva.component';
import { ListaReservaComponent } from '../lista-reserva/lista-reserva.component';

export const registradosRoutes: Routes = [
  { path: 'agregar', component: AgregarReservaComponent },
  { path: 'edit/:id', component: EditarReservaComponent },
  { path: 'lista', component: ListaReservaComponent }
];
