import { usuario } from "../usuarios/usuario";

export class mascota {
  id: number;
  nombre: string;
  raza: string;
  edad: string; 
  peso: string;
  cliente: usuario;
  //medicamentos: medicamento;
}
