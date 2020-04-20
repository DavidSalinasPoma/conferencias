import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Rutas
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

// Formularios
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Seleccionar
import { NgSelectModule } from '@ng-select/ng-select';

// Alertas
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// dataTables
import { DataTablesModule } from 'angular-datatables';

// Para trabajar con imagenes
import { AngularFileUploaderModule } from "angular-file-uploader";

// Modales
import { NgxSmartModalModule } from 'ngx-smart-modal';


// Componentes de la aplicacion
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { AssideComponent } from './components/shared/asside/asside.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { ContentComponent } from './components/shared/content/content.component';
import { LoginComponent } from './components/login/login.component';
import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { DashboardComponent } from './components/navegacion/dashboard/dashboard.component';
import { UsuariosComponent } from './components/navegacion/usuarios/usuarios.component';
import { ListaUsuarioComponent } from './components/navegacion/usuarios/lista-usuario/lista-usuario.component';
import { AgregarUsuarioComponent } from './components/navegacion/usuarios/agregar-usuario/agregar-usuario.component';
import { PerfilUsuarioComponent } from './components/navegacion/usuarios/perfil-usuario/perfil-usuario.component';
import { EventosComponent } from './components/navegacion/eventos/eventos.component';
import { EventosCategoriaComponent } from './components/navegacion/eventos-categoria/eventos-categoria.component';
import { EventosInvitadosComponent } from './components/navegacion/eventos-invitados/eventos-invitados.component';
import { RegistradosComponent } from './components/navegacion/registrados/registrados.component';
import { ListaEventosComponent } from './components/navegacion/eventos/lista-eventos/lista-eventos.component';
import { AgregarEventosComponent } from './components/navegacion/eventos/agregar-eventos/agregar-eventos.component';
import { PasswordValidationDirective } from './validations/password-validation.directive';
import { NombreValidationDirective } from './validations/nombre-validation.directive';
import { ApellidosValidationDirective } from './validations/apellidos-validation.directive';
import { RegalosComponent } from './components/navegacion/regalos/regalos.component';
import { ListaInvitadosComponent } from './components/navegacion/eventos-invitados/lista-invitados/lista-invitados.component';
import { AgregarInvitadosComponent } from './components/navegacion/eventos-invitados/agregar-invitados/agregar-invitados.component';
import { EditarInvitadosComponent } from './components/navegacion/eventos-invitados/editar-invitados/editar-invitados.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AssideComponent,
    FooterComponent,
    ContentComponent,
    LoginComponent,
    NavegacionComponent,
    DashboardComponent,
    UsuariosComponent,
    ListaUsuarioComponent,
    AgregarUsuarioComponent,
    PerfilUsuarioComponent,
    EventosComponent,
    EventosCategoriaComponent,
    EventosInvitadosComponent,
    RegistradosComponent,
    ListaEventosComponent,
    AgregarEventosComponent,
    PasswordValidationDirective,
    NombreValidationDirective,
    ApellidosValidationDirective,
    RegalosComponent,
    ListaInvitadosComponent,
    AgregarInvitadosComponent,
    EditarInvitadosComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DataTablesModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    AngularFileUploaderModule,
    NgSelectModule,
    NgxSmartModalModule.forRoot()

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
