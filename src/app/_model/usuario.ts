import { Pesaje } from './pesaje';
import { Rol } from './rol';

export class Usuario {
    public id: number;
    public username: string;
    public password: string;
    public enabled: string;
    public roles: Rol[];
    public pesajes: Pesaje[];
}
