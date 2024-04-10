import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { usuarioComponent } from './usuarios/usuario.component';
import { usuarioService } from './usuarios/usuario.service';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { mascotaComponent } from './mascota/mascota.component';
import { mascotaService } from './mascota/mascota.service';
import { medicamentoComponent } from './medicamento/medicamento.component';
import { medicamentoService } from './medicamento/medicamento.service';
import { ReporteComponent } from './reporte/reporte.component';
import { GraphQLModule } from './graphql.module';



const routes: Routes = [
  {path: '', component: usuarioComponent},
  {path: 'usuarios', component: usuarioComponent},
  {path: 'mascotas', component: mascotaComponent},
  {path: 'medicamentos', component: medicamentoComponent},
  {path: 'reporte', component: ReporteComponent}

]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    usuarioComponent,
    mascotaComponent,
    medicamentoComponent,
    ReporteComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,    
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    GraphQLModule
  ],
  providers: [usuarioService, mascotaService,  medicamentoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
