import { Recinto } from './recinto';

export class Conexion {
    public id: number;
    public nombre: string;
    public estado: string;
    public nombreUsuario: string;
    public clave: string;
    public bd: string;
    public ipMaquina: string;
    public recinto: Recinto;
    public fecha: string;
}