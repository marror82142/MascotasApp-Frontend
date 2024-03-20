import { Component, OnInit } from '@angular/core';
import { medicamentoService } from './medicamento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { medicamento } from './medicamento';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: 'medicamento.component.html'
})

export class medicamentoComponent implements OnInit {
  public medicamento: medicamento = new medicamento;
  medicamentos: medicamento[] = [];
  public medicamentoEditar: medicamento = null;
  public title = "Crear Medicamento";
  constructor(private medicamentoService: medicamentoService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.getMedicamentos();
  }

  public createMedicamento(): void{
    this.medicamentoService.create(this.medicamento)
          .subscribe(medicamento => {             
            swal.fire('Medicamento creada', `La medicamento de ${medicamento.nombre} ha sido creada`, 'success')        
            this.getMedicamentos();
          }
        );

  }

  public getMedicamentos():void{
    this.medicamentoService.getMedicamentos().subscribe(
      medicamentos => this.medicamentos = medicamentos
    ); 
  }


  delete(medicamento: medicamento): void {
    swal.fire({
      title: 'Esta seguro?',
      text: `Quiere eliminar al medicamento  ${medicamento.nombre}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.medicamentoService.delete(medicamento.id).subscribe(
          response => {
            this.medicamentos = this.medicamentos.filter(cli => cli !== medicamento)
            swal.fire(
              'Medicamento Eliminado',
              `Medicamento ${medicamento.nombre} eliminado correctamente.`,
              'success'
            )
            this.getMedicamentos();
          }
        )

      }
    })
  }

  getMedicamento(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id']
      if(id){
        this.medicamentoService.getMedicamento(id).subscribe( (medicamento) => this.medicamento = medicamento)
      }
    })
  }

  public create(): void{  
    if(this.medicamentoEditar!=null){
      this.update();
    }else{
      this.medicamentoService.getMedicamento(this.medicamento.nombre).subscribe( (medicamento) => {
        if(medicamento != null){
          swal.fire('Error', `El medicamento ya ha sido creado`, 'error')
        }else{    
          this.medicamentoService.create(this.medicamento)
          .subscribe(medicamento => {               
            this.medicamentoService.getMedicamentos().subscribe(
              medicamentos => this.medicamentos = medicamentos
            );
            this.router.navigate(['/login'])
            swal.fire('Nuevo medicamento', `medicamento ${medicamento.nombre}  creado`, 'success')
          });  
        }
      })      
    }
  }

  update():void{
    this.medicamentoService.update(this.medicamentoEditar)
    .subscribe( medicamentoEditar => {
      this.router.navigate(['/medicamentos'])
      this.medicamentoEditar=null;
      swal.fire('Medicamento actualizado', `medicamento ${medicamentoEditar.nombre} actualizado`, 'success')
    }
    )
  }

  edit(medicamentoEditar: medicamento):void{
    this.medicamentoEditar = medicamentoEditar;
  }


  
}
