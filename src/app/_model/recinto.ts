import { Ciudad } from './ciudad';
import { Aduana } from './aduana';
import { Conexion } from './conexion';

export class Recinto {
    public id: number;
    public nombre: string;
    public codRec: string;
    public estado: string;
    public fecha: string;
    public tipo: string;
    public ciudad: Ciudad;
    public aduanas: Aduana[];
    public conexiones: Conexion[];
}
