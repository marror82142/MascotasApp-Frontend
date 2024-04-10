import { Component, OnInit } from "@angular/core";
import { mascota } from "./mascota";
import { usuarioService } from "../usuarios/usuario.service";
import { usuario } from "../usuarios/usuario";
import { mascotaService } from "./mascota.service";
import swal from "sweetalert2";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { medicamento } from "../medicamento/medicamento";
import { medicamentoService } from "../medicamento/medicamento.service";
import { log } from "console";
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

const FIND_MASCOTA_BY_ID_QUERY = gql`
  query finMascotaById($id: Int!) {
    getMascotaById(id: $id) {
      id
      nombre
      raza
      edad
      peso
    }
  }
`;

const SAVE_MASCOTA_MUTATION = gql`
  mutation SaveMascota(
    $id: Int!
    $nombre: String!
    $edad: String!
    $peso: String!
    $raza: String!
    $idCliente: Int!
    $idMedicamento: Int!
  ) {
    saveMascota(
      id: $id
      nombre: $nombre
      edad: $edad
      peso: $peso
      raza: $raza
      idCliente: $idCliente
      idMedicamento: $idMedicamento
    ) {
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

const UPDATE_MASCOTA_MUTATION = gql`
  mutation UpdateMascota(
    $id: Int!
    $nombre: String!
    $edad: String!
    $peso: String!
    $raza: String!
    $idCliente: Int!
    $idMedicamento: Int!
  ) {
    updateMascota(
      id: $id
      nombre: $nombre
      edad: $edad
      peso: $peso
      raza: $raza
      idCliente: $idCliente
      idMedicamento: $idMedicamento
    ) {
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

const DELETE_MASCOTA_MUTATION = gql`
  mutation DeleteMascota($id: Int!) {
    deleteMascota(id: $id) {
      id
    }
  }
`;
@Component({
  selector: "app-mascota",
  templateUrl: "./mascota.component.html",
})
export class mascotaComponent implements OnInit {
  public mascotaActual = JSON.parse(localStorage.getItem("mascotaActual"));
  mascotas: mascota[] = [];
  public mascotasCliente: mascota[] = [];
  medicamentos: medicamento[] = [];
  public mascota: any = new mascota();
  public mascotaEditar: mascota = null;
  public usuarios: usuario[] = [];
  public usuarioAux: number = 0;
  public medicamentoAux: number = 0;

  public title = "Registro";
  constructor(
    private mascotaService: mascotaService,
    private router: Router,
    private usuarioService: usuarioService,
    private medicamentoService: medicamentoService,
    private apollo: Apollo
  ) {}

  ngOnInit() {
    this.getMedicineAllGraphql();
    this.getUsersGraphql();
    this.getMascotaAllGraphql();
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
        console.log('buscando todas',result)
        this.mascotas =
          JSON.parse(JSON.stringify(result.data.findAllMascota)) || [];
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

  getMascotaById(id: number) {
    return this.apollo.watchQuery({
      query: FIND_MASCOTA_BY_ID_QUERY,
      variables: {
        id,
      },
    }).valueChanges;
  }

  createMascotaGraphql({
    id,
    nombre,
    edad,
    peso,
    raza,
    idCliente,
    idMedicamento,
  }: mascota) {
    return this.apollo.mutate({
      mutation: SAVE_MASCOTA_MUTATION,
      variables: {
        id,
        nombre,
        edad,
        peso,
        raza,
        idCliente,
        idMedicamento,
      },
    });
  }

  delete(mascota: mascota): void {
    swal
      .fire({
        title: "Esta seguro?",
        text: `Quiere eliminar la mascota  ${mascota.nombre}?`,
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
              mutation: DELETE_MASCOTA_MUTATION,
              variables: {
                id: mascota.id,
              },
            })
            .subscribe((response) => {
              this.mascotas = this.mascotas.filter(
                (cli) => cli.id !== mascota.id
              );
              swal.fire(
                "Mascota Eliminada",
                `Mascota ${mascota.nombre} eliminada correctamente.`,
                "success"
              );
            });
        }
      });
  }

  public create(): void {
    if (this.mascotaEditar != null) {
      this.update();
    } else {
      this.mascota.cliente = this.usuarios.find(
        (u) => u.cedula == this.usuarioAux
      );
      this.mascota.medicamento = this.medicamentos.find(
        (m) => m.id == this.medicamentoAux
      );
      for (let index = 0; index < this.mascotas.length; index++) {
        if (this.mascotas[index].cliente.cedula == this.usuarioAux) {
          this.mascotasCliente.push(this.mascotas[index]);
        }
      }
      const val =
        String(this.usuarioAux) + String(this.mascotasCliente.length + 1);
      this.mascota.id = Number(val);
      this.mascota.idCliente = this.mascota.cliente.cedula;
      this.mascota.idMedicamento = this.mascota.medicamento.id;

      this.getMascotaById(this.mascota.id).subscribe((mascotaApi: any) => {
        const mascota = JSON.parse(
          JSON.stringify(mascotaApi.data.getMascotaById)
        ) as usuario;
        if (mascota != null) {
          swal.fire("Error", `La mascota ya ha sido creado`, "error");
        } else {
          this.createMascotaGraphql(this.mascota).subscribe((mascota: any) => {
            this.mascotas.push(mascota.data.saveMascota);
            swal.fire(
              "Nueva mascota",
              `mascota ${this.mascota.nombre}  creada`,
              "success"
            );
          });
        }
      });
    }
  }

  update(): void {
    this.apollo
      .mutate({
        mutation: UPDATE_MASCOTA_MUTATION,
        variables: {
          id: this.mascotaEditar.id,
          nombre: this.mascotaEditar.nombre,
          edad: this.mascotaEditar.edad,
          peso: this.mascotaEditar.peso,
          raza: this.mascotaEditar.raza,
          idCliente: this.usuarioAux,
          idMedicamento: this.medicamentoAux,
        },
      })
      .subscribe((m) => {
       
         this.updateView();
         this.mascotaEditar = null;
         this.usuarioAux = null;
         this.medicamentoAux = null;
      });
  }

  edit(mascotaEditar: mascota): void {
    this.mascotaEditar = mascotaEditar;
    this.usuarioAux = mascotaEditar.cliente.cedula;
    this.medicamentoAux = mascotaEditar.medicamento.id;
  }

  updateView(): void {
    window.location.reload();
  }
}

