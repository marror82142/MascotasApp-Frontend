import { Component, OnInit } from "@angular/core";
import { medicamentoService } from "./medicamento.service";
import { ActivatedRoute, Router } from "@angular/router";
import { medicamento } from "./medicamento";
import swal from "sweetalert2";
import { Apollo, gql } from "apollo-angular";
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

const DELETE_MEDICINE_MUTATION = gql`
  mutation DeleteMedicine($id: Int!) {
    deleteMedicine(id: $id) {
      dosis
      id
      nombre
      descripcion
    }
  }
`;

const UPDATE_MEDICINE_MUTATION = gql`
  mutation UpdateMedicine(
    $id: Int!
    $nombre: String!
    $descripcion: String!
    $dosis: String!
  ) {
    updateMedicine(
      id: $id
      nombre: $nombre
      descripcion: $descripcion
      dosis: $dosis
    ) {
      dosis
      id
      nombre
      descripcion
    }
  }
`;

const FIND_MEDICINE_BY_ID_QUERY = gql`
  query FindMedicineById($nombre: String!) {
    getMedicineById(nombre: $nombre) {
      dosis
      id
      nombre
      descripcion
    }
  }
`;

const SAVE_MEDICINE_MUTATION = gql`
  mutation SaveMedicine(
    $nombre: String!
    $descripcion: String!
    $dosis: String!
  ) {
    saveMedicine(nombre: $nombre, descripcion: $descripcion, dosis: $dosis) {
      dosis
      id
      nombre
      descripcion
    }
  }
`;
@Component({
  selector: "app-form",
  templateUrl: "medicamento.component.html",
})
export class medicamentoComponent implements OnInit {
  public medicamento: medicamento = new medicamento();
  medicamentos: medicamento[] = [];
  public medicamentoEditar: medicamento = null;
  public title = "Crear Medicamento";
  constructor(
    private medicamentoService: medicamentoService,
    private apollo: Apollo
  ) {}

  ngOnInit(): void {
    this.getMedicineAllGraphql();
  }

  public createMedicamento(): void {
    this.medicamentoService
      .create(this.medicamento)
      .subscribe((medicamento) => {
        swal.fire(
          "Medicamento creada",
          `La medicamento de ${medicamento.nombre} ha sido creada`,
          "success"
        );
        this.getMedicineAllGraphql();
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

  delete(medicamento: medicamento): void {
    swal
      .fire({
        title: "Esta seguro?",
        text: `Quiere eliminar al medicamento  ${medicamento.nombre}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.value) {
          this.apollo
            .mutate({
              mutation: DELETE_MEDICINE_MUTATION,
              variables: {
                id: medicamento.id,
              },
            })
            .subscribe(() => {
              this.medicamentos = this.medicamentos.filter(
                (cli) => cli.id !== medicamento.id
              );
              swal.fire(
                "Medicamento Eliminado",
                `Medicamento ${medicamento.nombre} eliminado correctamente.`,
                "success"
              );
            });
        }
      });
  }

  createMedicineGraphql({ nombre, descripcion, dosis }: medicamento) {
    return this.apollo.mutate({
      mutation: SAVE_MEDICINE_MUTATION,
      variables: {
        nombre,
        descripcion,
        dosis,
      },
    });
  }

  getMedicineById(nombre: string) {
    return this.apollo.watchQuery({
      query: FIND_MEDICINE_BY_ID_QUERY,
      variables: {
        nombre,
      },
    }).valueChanges;
  }
  public create(): void {
    if (this.medicamentoEditar != null) {
      this.update();
    } else {
      this.getMedicineById(this.medicamento.nombre).subscribe(
        (medicamentoApi: any) => {
          console.log(medicamentoApi, "medicamentoApi");
          const medicamento = JSON.parse(
            JSON.stringify(medicamentoApi.data.getMedicineById)
          ) as medicamento;
          if (medicamento != null) {
            swal.fire("Error", `El medicamento ya ha sido creado`, "error");
          } else {
            this.createMedicineGraphql(this.medicamento).subscribe(
              (medicamento: any) => {
                this.medicamentos.push(medicamento.data.saveMedicine);
                swal.fire(
                  "Nuevo medicamento",
                  `medicamento ${this.medicamento.nombre}  creado`,
                  "success"
                );
              }
            );
          }
        }
      );
    }
  }

  update(): void {
    this.apollo
      .mutate({
        mutation: UPDATE_MEDICINE_MUTATION,
        variables: {
          id: this.medicamentoEditar.id,
          nombre: this.medicamentoEditar.nombre,
          descripcion: this.medicamentoEditar.descripcion,
          dosis: this.medicamentoEditar.dosis,
        },
      })
      .subscribe(() => {
        swal.fire(
          "Medicamento actualizado",
          `medicamento ${this.medicamentoEditar.nombre} actualizado`,
          "success"
        );
        this.medicamentoEditar = null;
      });
  }

  edit(medicamentoEditar: medicamento): void {
    this.medicamentoEditar = medicamentoEditar;
  }
}
