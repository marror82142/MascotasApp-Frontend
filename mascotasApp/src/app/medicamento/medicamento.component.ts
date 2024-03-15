import { Component, OnInit } from '@angular/core';
import { medicamentoService } from './medicament.service';
import { Router } from '@angular/router';
import { medicamento } from './medicamento';
import { NgbModule  } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: 'medicamento.component.html'
})

export class medicamentoComponent implements OnInit {
  public medicamento: medicamento = new medicamento;
  public usuarioActual=JSON.parse(localStorage.getItem("usuarioActual"));
  public title = "Crear Medicamento";
  constructor(private medicamentoService: medicamentoService,
              private router: Router) { }

  ngOnInit(): void {
  }

  public createMedicamento(): void{
    this.medicamentoService.createMedicamento(this.medicamento)
          .subscribe(medicamento => {             
            Swal.fire('Medicamento creada', `La medicamento de ${medicamento.nombre} ha sido creada`, 'success')
          }
        );
  }
}
