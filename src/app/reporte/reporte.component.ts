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
import { Apollo, gql } from 'apollo-angular';
const GET_USERS = gql`
  query {
    findAllUsers {
      cedula
      nombres
      apellidos
      direccion
      telefono
    }
  }
`;
const GET_MEDICINES = gql`
  query {
    findAllMedicine {
      dosis
      id
      nombre
      descripcion
    }
  }
`;
const GET_MASCOTAS = gql`
  query {
    findAllMascota {
      id
      nombre
      raza
      edad
      peso
      cliente {
        cedula
        nombres
        apellidos
        direccion
        telefono
      }
      medicamento {
        dosis
        id
        nombre
        descripcion
      }
    }
  }
`;
@Component({
  selector: "app-reporte",
  templateUrl: "./reporte.component.html",
})
export class ReporteComponent implements OnInit {
  @ViewChild("pdfContent", { static: false }) pdfContent!: ElementRef;
  @ViewChild("pdfContent1", { static: false }) pdfContent1!: ElementRef;
  @ViewChild("pdfContent2", { static: false }) pdfContent2!: ElementRef;
  medicamentos: medicamento[] = [];
  mascotas: mascota[] = [];
  usuarios: usuario[] = [];
  usuarioAux: number;
  mascotasUsuario: mascotaUsuario[] = [];
  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.getMedicineAllGraphql();
    this.getUsersGraphql();
    this.getMascotaAllGraphql();
  }

  generateReport(): void {
    const pdf = new jspdf.jsPDF();
    html2canvas(this.pdfContent.nativeElement).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      pdf.addImage(imageData, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), 0);
      pdf.save("medicamentos.pdf");
    });
  }

  generateReportUsuarios(): void {
    const pdf = new jspdf.jsPDF();
    html2canvas(this.pdfContent1.nativeElement).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      pdf.addImage(imageData, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), 0);
      pdf.save("usuarios.pdf");
    });
  }

  generateReportMascotaUsuarios(): void {
    const pdf = new jspdf.jsPDF();
    html2canvas(this.pdfContent2.nativeElement).then((canvas) => {
      const imageData = canvas.toDataURL("image/png");
      pdf.addImage(imageData, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), 0);
      pdf.save("mascotasUsuario.pdf");
    });
  }

  getUsersGraphql(): void {
    this.apollo
      .watchQuery({
        query: GET_USERS,
      })
      .valueChanges.subscribe((result: any) => {
        this.usuarios =
          JSON.parse(JSON.stringify(result.data.findAllUsers)) || [];
      });
  }

  public getMedicineAllGraphql(): void {
    this.apollo
      .watchQuery({
        query: GET_MEDICINES,
      })
      .valueChanges.subscribe((result: any) => {
        this.medicamentos =
          JSON.parse(JSON.stringify(result.data.findAllMedicine)) || [];
      });
  }
  public getMascotaAllGraphql(): void {
    this.apollo
      .watchQuery({
        query: GET_MASCOTAS,
      })
      .valueChanges.subscribe((result: any) => {
        console.log(result.data.findAllMascota);
        this.mascotasUsuario =
          JSON.parse(JSON.stringify(result.data.findAllMascota)) || [];
      });
  }

  updateView(): void {
    window.location.reload();
  }
}

