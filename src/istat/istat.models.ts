export interface Regione {
  nome: string;
  codice: string;
}

export interface Provincia {
  nome: string;
  codice: string;
  regione: string;
}

export interface Comune {
  nome: string;
  codice: string;
  regione: string;
  provincia: string;
}
