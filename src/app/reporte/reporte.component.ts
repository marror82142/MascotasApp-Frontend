import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { medicamentoService } from '../medicamento/medicamento.service';
import { medicamento } from '../medicamento/medicamento';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { usuarioService } from '../usuarios/usuario.service';
import { usuario } from '../usuarios/usuario';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
})
export class ReporteComponent implements OnInit {

  @ViewChild('pdfContent', { static: false }) pdfContent!: ElementRef;
  @ViewChild('pdfContent1', { static: false }) pdfContent1!: ElementRef;
  public medicamentos: medicamento[] = [];
  usuarios: usuario[] = [];
  constructor(private medicamentoService: medicamentoService,private usuarioService: usuarioService) { }

  ngOnInit(): void {
    this.getMedicamentos();
    this.getUsuarios();
  }

   generateReport():void{
    const pdf = new jspdf.jsPDF();
    html2canvas(this.pdfContent.nativeElement).then(canvas => {
      const imageData = canvas.toDataURL('image/png')
      pdf.addImage(imageData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(),0);
      pdf.save('medicamentos.pdf');
    });
  }

  
  generateReportUsuarios():void{
    const pdf = new jspdf.jsPDF();
    html2canvas(this.pdfContent1.nativeElement).then(canvas => {
      const imageData = canvas.toDataURL('image/png');
      pdf.addImage(imageData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(),0);
      pdf.save('usuarios.pdf');
    });
  }

  getMedicamentos(){
    this.medicamentoService.getMedicamentos().subscribe(
      medicamentos => this.medicamentos = medicamentos
    ); 
  }

  getUsuarios():void{
    this.usuarioService.getUsuarios().subscribe(
      usuarios => this.usuarios = usuarios
    ); 
  }
}
