export interface BalanzaUsuario {
    balanzaUsuarioPK: BalanzaUsuarioPK;
    busEstado:        string;
    busPasswd:        string;
    balanza:          Balanza;
}

export interface Balanza {
    blzCod:         string;
    blzDescripcion: string;
    blzIp:          string;
    blzEstado:      string;
    blzFile:        string;
    blzPuerto:      string;
    blzCodcontrol:  string;
    blzNumeracion:  string;
}

export interface BalanzaUsuarioPK {
    usrCod: string;
    blzCod: string;
}