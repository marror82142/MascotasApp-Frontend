import { Component, OnInit } from "@angular/core";
import { usuario } from "./usuario";
import swal from "sweetalert2";
import { mascota } from "../mascota/mascota";
import { Apollo, gql } from "apollo-angular";
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

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($cedula: Int!) {
    deleteUser(cedula: $cedula) {
      cedula
      nombres
    }
  }
`;

const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser(
    $cedula: Int!
    $nombres: String!
    $apellidos: String!
    $direccion: String!
    $telefono: String!
  ) {
    updateUser(
      cedula: $cedula
      nombres: $nombres
      apellidos: $apellidos
      direccion: $direccion
      telefono: $telefono
    ) {
      cedula
      nombres
      apellidos
      direccion
      telefono
    }
  }
`;

const FIND_USER_BY_CEDULA_QUERY = gql`
  query FindUserByCedula($cedula: Int!) {
    getUserByCedula(cedula: $cedula) {
      cedula
      nombres
    }
  }
`;

const SAVE_USER_MUTATION = gql`
  mutation SaveUser(
    $cedula: Int!
    $nombres: String!
    $apellidos: String!
    $direccion: String!
    $telefono: String!
  ) {
    saveUser(
      cedula: $cedula
      nombres: $nombres
      apellidos: $apellidos
      direccion: $direccion
      telefono: $telefono
    ) {
      cedula
      nombres
      apellidos
      direccion
      telefono
    }
  }
`;

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuario.component.html",
})
export class usuarioComponent implements OnInit {
  public usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
  usuarios: usuario[] = [];
  public usuario: usuario = new usuario();
  public usuarioEditar: usuario = null;
  public mascota: mascota = new mascota();
  public contrasenaAconfirmar: string = "";

  public title = "Registro";
  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.getUsersGraphql();
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

  delete(usuario: usuario): void {
    swal
      .fire({
        title: "Esta seguro?",
        text: `Quiere eliminar al usuario  ${usuario.nombres} ${usuario.apellidos}?`,
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
              mutation: DELETE_USER_MUTATION,
              variables: {
                cedula: usuario.cedula,
              },
            })
            .subscribe(() => {
              this.usuarios = this.usuarios.filter((cli) => cli.cedula !== usuario.cedula);
              swal.fire(
                "Usuario Eliminado",
                `Usuario ${usuario.nombres} ${usuario.apellidos} eliminado correctamente.`,
                "success"
              );
            });
        }
      });
  }

  getUsuarioByCedula(cedula: number) {
    return this.apollo.watchQuery({
      query: FIND_USER_BY_CEDULA_QUERY,
      variables: {
        cedula: cedula,
      },
    }).valueChanges;
  }

  createUsuarioGraphql({
    cedula,
    nombres,
    apellidos,
    direccion,
    telefono,
  }: usuario) {
    return this.apollo.mutate({
      mutation: SAVE_USER_MUTATION,
      variables: {
        cedula,
        nombres,
        apellidos,
        direccion,
        telefono,
      },
    });
  }

  public create(): void {
    if (this.usuarioEditar != null) {
      this.update();
    } else {
      this.getUsuarioByCedula(this.usuario.cedula).subscribe(
        (usuarioApi: any) => {
          const usuario = JSON.parse(
            JSON.stringify(usuarioApi.data.getUserByCedula)
          ) as usuario;
          if (usuario != null) {
            swal.fire("Error", `El usuario ya ha sido creado`, "error");
          } else {
            this.createUsuarioGraphql(this.usuario).subscribe(
              (usuario: any) => {
                this.usuarios.push(usuario.data.saveUser);

                swal.fire(
                  "Nuevo usuario",
                  `usuario ${this.usuario.nombres} ${this.usuario.apellidos}  creado`,
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
        mutation: UPDATE_USER_MUTATION,
        variables: {
          cedula: this.usuarioEditar.cedula,
          nombres: this.usuarioEditar.nombres,
          apellidos: this.usuarioEditar.apellidos,
          direccion: this.usuarioEditar.direccion,
          telefono: this.usuarioEditar.telefono,
        },
      })
      .subscribe(() => {
        swal.fire(
          "Usuario actualizado",
          `usuario ${this.usuarioEditar.nombres} ${this.usuarioEditar.apellidos} actualizado`,
          "success"
        );
      });
  }

  edit(usuarioEditar: usuario): void {
    this.usuarioEditar = usuarioEditar;
  }
}
