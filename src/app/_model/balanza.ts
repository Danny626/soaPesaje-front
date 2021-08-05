import { Aduana } from './aduana';
import { Pesaje } from './pesaje';
import { Parametro } from './parametro';
export class Balanza {
    public id: number;
    public nombre: string;
    public codigo: string;
    public fecha: string;
    public estado: string;
    public tipo: string;
    public aduana: Aduana;
    public pesajes: Pesaje[];
    public parametros: Parametro[];
}
