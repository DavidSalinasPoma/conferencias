
/***RUTAS DEL COMPONENTE PRINCIPAL */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Rutas Hija navegacion
import { navegacionRoutes } from './components/navegacion/route/route-routing.module';

// los componentes de primer nivel Padre
import { LoginComponent } from './components/login/login.component';
import { NavegacionComponent } from './components/navegacion/navegacion.component';


const ROUTES: Routes = [
  // Definir la ruta por defecto
  { path: '', component: LoginComponent },
  { path: 'inicio', component: LoginComponent },
  // estas dos rutas interctuaran con La contraseña
  {
    path: 'navegacion',
    component: NavegacionComponent,
    children: navegacionRoutes
  },
  // {
  //   path: 'usuarios/:id',
  //   component: UsuariosComponent,
  //   children: USUARIO_ROUTES
  // },
  { path: '**', pathMatch: 'full', redirectTo: 'inicio' }, // para mostrar la pagina por defecto

];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
