import { Balanza } from './balanza';

export class Parametro {
    public id: number;
    public puerto: string;
    public baudRate: string;
    public paridad: string;
    public stopBits: string;
    public byteSize: string;
    public balanza: Balanza;
}
