import {Component, OnInit} from '@angular/core';
import {mascota} from './mascota';
import {usuarioService} from '../usuarios/usuario.service';
import {usuario} from '../usuarios/usuario';
import {mascotaService} from './mascota.service';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import {medicamento} from '../medicamento/medicamento';
import {medicamentoService} from '../medicamento/medicamento.service';
import { log } from 'console';

@Component({
  selector: 'app-mascota',
  templateUrl: './mascota.component.html'
})

export class mascotaComponent implements OnInit {
  public mascotaActual=JSON.parse(localStorage.getItem("mascotaActual"));
  mascotas: mascota[] = [];
  medicamentos: medicamento[] = [];
  public mascota: mascota = new mascota;
  public mascotaEditar: mascota = null;
  public usuarios: usuario[] = [];

  public title = "Registro";
  constructor(private mascotaService: mascotaService,
              private router: Router,
              private usuarioService: usuarioService,
              private medicamentoService: medicamentoService,
              private activatedRoute: ActivatedRoute) { }


  ngOnInit(){
    this.mascotaService.getMascotas().subscribe(
      mascotas => this.mascotas = mascotas
    );
    this.usuarioService.getUsuarios().subscribe(
      usuarios => {this.usuarios = usuarios}
    );
    this.medicamentoService.getMedicamentos().subscribe(
      medicamentos => {this.medicamentos = medicamentos}
    );
  }

  delete(mascota: mascota): void {
    swal.fire({
      title: 'Esta seguro?',
      text: `Quiere eliminar la mascota  ${mascota.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.mascotaService.delete(mascota.id).subscribe(
          response => {
            this.mascotas = this.mascotas.filter(cli => cli !== mascota)
            swal.fire(
              'Mascota Eliminada',
              `Mascota ${mascota.nombre} eliminada correctamente.`,
              'success'
            )
          }
        )

      }
    })
  }

  getMascota(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.mascotaService.getMascota(id).subscribe( (mascota) => this.mascota = mascota)
      }
    })
  }

  public create(): void{   
    if(this.mascotaEditar!=null){
      this.update();
    }else{
      this.mascotaService.getMascota(this.mascota.id).subscribe( (mascota) => {
        if(mascota != null){
          swal.fire('Error', `La mascota ya ha sido creado`, 'error')
        }else{ 
          this.mascota.cliente = this.usuarios.find(u => u.cedula == this.mascota.cliente as any)
          this.mascotaService.create(this.mascota)
          .subscribe(mascota => {               
            this.mascotaService.getMascotas().subscribe(
              mascotas => this.mascotas = mascotas
            );
            this.router.navigate(['/login'])
            swal.fire('Nueva mascota', `mascota ${mascota.nombre}  creada`, 'success')
          });  
      }
      })      
    }
  }

  update():void{
    this.mascotaService.update(this.mascotaEditar)
    .subscribe( mascotaEditar => {
      this.router.navigate(['/mascotas'])
      swal.fire('Mascota actualizado', `mascota ${mascotaEditar.nombre} actualizada`, 'success')
    }
    )
  }

  edit(mascotaEditar: mascota):void{
    this.mascotaEditar = mascotaEditar;
  }

}
