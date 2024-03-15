import {Component, OnInit} from '@angular/core';
import {mascota} from './mascota';
import {mascotaService} from './mascota.service';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { donacion } from '../medicamento/medicamento';

@Component({
  selector: 'app-mascota',
  templateUrl: './mascota.component.html'
})

export class mascotaComponent implements OnInit {
  public mascotaActual=JSON.parse(localStorage.getItem("mascotaActual"));
  mascotas: mascota[] = [];
  public mascota: mascota = new mascota;
  public mascotaEditar: mascota = null;

  public title = "Registro";
  constructor(private mascotaService: mascotaService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(){
    if(this.mascotaActual !== null){
      if(this.mascotaActual && this.mascotaActual.rol !== "Admin"){
        this.mascotaEditar = this.mascotaActual
      }
      this.mascotaService.getMascotas().subscribe(
        mascotas => this.mascotas = mascotas
      );
    }
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
