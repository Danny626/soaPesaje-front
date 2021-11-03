import { Pesaje } from "../_model/pesaje";

export interface PesajesSincronizadosDTO {
    cantidad:   number;
    cantSinc:   number;
    cantError:  number;
    listaError: Pesaje[];
}