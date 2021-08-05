import { Usuario } from './usuario';
import { Balanza } from './balanza';

export class Pesaje {
    public id: number;
    public peso: number;
    public pesoTara: number;
    public pesoNeto: number;
    public fecha: string;
    public placa: string;
    public observacion: string;
    public gestion: string;
    public estado: string;
    public envioServidor: string;
    public fechaServidor: string;
    public operacion: string;
    public balanza: Balanza;
    public usuario: Usuario;
}
