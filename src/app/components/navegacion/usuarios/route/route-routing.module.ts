
/***RUTAS DEL COMPONENTE USUARIOS */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes de usuario
import { AgregarUsuarioComponent } from '../agregar-usuario/agregar-usuario.component';
import { PerfilUsuarioComponent } from '../perfil-usuario/perfil-usuario.component';
import { ListaUsuarioComponent } from '../lista-usuario/lista-usuario.component';

export const usuariosRoutes: Routes = [
  { path: 'agregar', component: AgregarUsuarioComponent },
  { path: 'perfil', component: PerfilUsuarioComponent },
  { path: 'lista', component: ListaUsuarioComponent }
];
