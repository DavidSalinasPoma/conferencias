import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes de la categoria
import { AgregarCategoriaComponent } from '../agregar-categoria/agregar-categoria.component';
import { ListaCategoriaComponent } from '../lista-categoria/lista-categoria.component';
import { EditarCategoriaComponent } from '../editar-categoria/editar-categoria.component';


export const categoriaRoutes: Routes = [
  { path: 'agregar', component: AgregarCategoriaComponent },
  { path: 'listar', component: ListaCategoriaComponent },
  { path: 'editar/:id', component: EditarCategoriaComponent }
];


