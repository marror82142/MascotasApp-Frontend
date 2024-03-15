import {Component, OnInit} from '@angular/core';
import {usuario} from './usuario';
import {usuarioService} from './usuario.service';
import swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { mascota } from '../mascota/mascota';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuario.component.html'
})

export class usuarioComponent implements OnInit {
  public usuarioActual=JSON.parse(localStorage.getItem("usuarioActual"));
  usuarios: usuario[] = [];
  public usuario: usuario = new usuario;
  public usuarioEditar: usuario = null;
  public mascota: mascota = new mascota;
  public contrasenaAconfirmar:string="";

  public title = "Registro";
  constructor(private usuarioService: usuarioService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(){
    if(this.usuarioActual !== null){
      if(this.usuarioActual && this.usuarioActual.rol !== "Admin"){
        this.usuarioEditar = this.usuarioActual
      }
      this.usuarioService.getUsuarios().subscribe(
        usuarios => this.usuarios = usuarios
      );
    }
  }

  delete(usuario: usuario): void {
    swal.fire({
      title: 'Esta seguro?',
      text: `Quiere eliminar al usuario  ${usuario.nombres} ${usuario.apellidos}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.usuarioService.delete(usuario.cedula).subscribe(
          response => {
            this.usuarios = this.usuarios.filter(cli => cli !== usuario)
            swal.fire(
              'Usuario Eliminado',
              `Usuario ${usuario.nombres} ${usuario.apellidos} eliminado correctamente.`,
              'success'
            )
          }
        )

      }
    })
  }

  getUsuario(): void{
    this.activatedRoute.params.subscribe(params => {
      let cedula = params['cedula']
      if(cedula){
        this.usuarioService.getUsuario(cedula).subscribe( (usuario) => this.usuario = usuario)
      }
    })
  }

  public create(): void{  
    if(this.usuarioEditar!=null){
      this.update();
    }else{
      this.usuarioService.getUsuario(this.usuario.cedula).subscribe( (usuario) => {
        if(usuario != null){
          swal.fire('Error', `El usuario ya ha sido creado`, 'error')
        }else{    
          this.usuarioService.create(this.usuario)
          .subscribe(usuario => {               
            this.usuarioService.getUsuarios().subscribe(
              usuarios => this.usuarios = usuarios
            );
            this.router.navigate(['/login'])
            swal.fire('Nuevo usuario', `usuario ${usuario.nombres} ${usuario.apellidos}  creado`, 'success')
          });  
        }
      })      
    }
  }

  update():void{
    this.usuarioService.update(this.usuarioEditar)
    .subscribe( usuarioEditar => {
      this.router.navigate(['/usuarios'])
      swal.fire('Usuario actualizado', `usuario ${usuarioEditar.nombres} ${usuarioEditar.apellidos} actualizado`, 'success')
    }
    )
  }

  edit(usuarioEditar: usuario):void{
    this.usuarioEditar = usuarioEditar;
  }

}
