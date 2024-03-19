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



const routes: Routes = [
  {path: '', component: usuarioComponent},
  {path: 'usuarios', component: usuarioComponent},
  {path: 'mascotas', component: mascotaComponent},
  {path: 'medicamento', component: medicamentoComponent}

]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    usuarioComponent,
    mascotaComponent,
    medicamentoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,    
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [usuarioService, mascotaService,  medicamentoService],
  bootstrap: [AppComponent]
})
export class AppModule { }
