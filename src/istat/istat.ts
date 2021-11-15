import fetch from "node-fetch";
import xlsx from "xlsx";
import { Comune, Provincia, Regione } from "./istat.models";
import { sanitizeProvincia, sanitizeRegione } from "../utils/utils";

const ISTAT_URL =
  "https://www.istat.it/storage/codici-unita-amministrative/Elenco-comuni-italiani.xls";

export const fetchFromApi = async () => {
  console.log("Fetching file");

  const res = await fetch(ISTAT_URL);
  const buffer = await res.buffer();
  const workbook = xlsx.read(buffer);
  const csv = xlsx.utils
    .sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]])
    .split("\n");

  console.log("Fetching file completed");

  console.log("Reading file and mapping");

  const comuni: Comune[] = [];
  const province: Provincia[] = [];
  const regioni: Regione[] = [];

  for (let i = 3; i < csv.length; i++) {
    const comune = csv[i].split(",");

    const [
      codiceRegione,
      codiceUnitàTerritoriale,
      codiceProvincia,
      progressivoComune,
      codiceComuneAlfanumerico,
      denominazioneComune,
      denominazioneInItaliano,
      hidden1,
      hidden2,
      ripartizioneGeografica,
      denominazioneRegione,
      denominazioneProvincia,
      tipologiaUnitaTerritoriale,
      isCapoluogoProvincia,
      siglaAuto,
    ] = comune;

    // Comuni
    const codComune = codiceComuneAlfanumerico?.trim();
    if (codComune && !comuni.some((x) => x.codice === codComune)) {
      comuni.push({
        nome: denominazioneComune?.trim(),
        codice: codComune,
        regione: sanitizeRegione(denominazioneRegione),
        provincia: sanitizeProvincia(denominazioneProvincia),
      });
    }

    // Province
    const codProvincia = codiceProvincia?.trim();
    if (codProvincia && !province.some((x) => x.codice === codProvincia)) {
      province.push({
        nome: sanitizeProvincia(denominazioneProvincia),
        codice: codProvincia,
        regione: sanitizeRegione(denominazioneRegione),
      });
    }

    // Regioni
    const codRegione = codiceRegione?.trim();
    if (codRegione && !regioni.some((x) => x.codice === codRegione)) {
      regioni.push({
        nome: sanitizeRegione(denominazioneRegione),
        codice: codRegione,
      });
    }
  }

  console.log("Reading file completed");

  return { regioni, province, comuni };
};
