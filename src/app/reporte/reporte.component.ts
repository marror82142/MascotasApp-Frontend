import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { medicamentoService } from '../medicamento/medicamento.service';
import { medicamento } from '../medicamento/medicamento';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { usuarioService } from '../usuarios/usuario.service';
import { usuario } from '../usuarios/usuario';
import { mascota } from '../mascota/mascota';
import { mascotaUsuario } from './mascotaUsuario';
import { mascotaService } from '../mascota/mascota.service';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
})
export class ReporteComponent implements OnInit {

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  @ViewChild('pdfContent1', { static: false }) pdfContent1!: ElementRef;
  @ViewChild('pdfContent2', { static: false }) pdfContent2!: ElementRef;
  medicamentos: medicamento[] = [];
  mascotas: mascota[] = [];
  usuarios: usuario[] = [];
  usuarioAux: number;
  mascotasUsuario: mascotaUsuario[] = [];
  constructor(private medicamentoService: medicamentoService,
              private usuarioService: usuarioService, 
              private mascotaService: mascotaService) { }

  ngOnInit(): void {
    this.getMedicamentos();
    this.getUsuarios();
    this.getMascotas()
  }

   generateReport():void{
    const pdf = new jspdf.jsPDF();
    html2canvas(this.pdfContent.nativeElement).then(canvas => {
      const imageData = canvas.toDataURL('image/png')
      pdf.addImage(imageData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(),0);
      pdf.save('medicamentos.pdf');
    });
  }

  llenarLista(): void{
    console.log(this.mascotas.length)
    for (let index = 0; index < this.mascotas.length; index++) {
      let mascotaU = new mascotaUsuario
      mascotaU.cedula = this.mascotas[index].cliente.cedula
      mascotaU.nombre = String(this.mascotas[index].cliente.nombres)
      mascotaU.mascota = this.mascotas[index].nombre
      mascotaU.medicamento = this.mascotas[index].medicamento.nombre
      console.log(mascotaU)
      this.mascotasUsuario.push(mascotaU)
    }
  }

  
  generateReportUsuarios():void{
    const pdf = new jspdf.jsPDF();
    html2canvas(this.pdfContent1.nativeElement).then(canvas => {
      const imageData = canvas.toDataURL('image/png');
      pdf.addImage(imageData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(),0);
      pdf.save('usuarios.pdf');
    });
  }

  generateReportMascotaUsuarios():void{
    const pdf = new jspdf.jsPDF();
    html2canvas(this.pdfContent2.nativeElement).then(canvas => {
      const imageData = canvas.toDataURL('image/png');
      pdf.addImage(imageData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(),0);
      pdf.save('mascotasUsuario.pdf');
    });
  }

  getMedicamentos(){
    this.medicamentoService.getMedicamentos().subscribe(
      medicamentos => this.medicamentos = medicamentos
    ); 
  }

  getUsuarios():void{
    this.usuarioService.getUsuarios().subscribe(
      usuarios => {this.usuarios = usuarios}
    ); 
  }

  getMascotas():void{
    this.mascotaService.getMascotas().subscribe(
      mascotas => {this.mascotas = mascotas
        for (let index = 0; index < this.mascotas.length; index++) {
          let mascotaU = new mascotaUsuario
          mascotaU.cedula = this.mascotas[index].cliente.cedula
          mascotaU.nombre = String(this.mascotas[index].cliente.nombres + " " + this.mascotas[index].cliente.apellidos)
          mascotaU.mascota = this.mascotas[index].nombre
          mascotaU.medicamento = this.mascotas[index].medicamento.nombre
          console.log(mascotaU)
          this.mascotasUsuario.push(mascotaU)
        }            
      }
    ); 
  }
}

