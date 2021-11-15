import path from "path";
import fs from "fs";
import { Comune, Provincia, Regione } from "../istat/istat.models";

export const exportAsJson = async (
  regioni: Regione[],
  province: Provincia[],
  comuni: Comune[]
) => {
  console.log("Exporting files");

  // Expect: /out/italia/lombardia/milano/towns.json
  const dirOut = path.resolve(__dirname + "\\..\\..\\out");
  fs.rmdirSync(dirOut, { recursive: true });
  if (!fs.existsSync(dirOut)) {
    fs.mkdirSync(dirOut);
  }

  // Stati
  const dirState = path.resolve(dirOut + "\\italia");
  if (!fs.existsSync(dirState)) {
    fs.mkdirSync(dirState);
  }

  // Regioni
  fs.writeFileSync(
    dirState + "\\regions.json",
    JSON.stringify(regioni),
    "utf-8"
  );

  for (const regione of regioni) {
    const dirRegione = path.resolve(
      dirState + "\\" + encodeURIComponent(regione.nome.toLowerCase())
    );
    if (!fs.existsSync(dirRegione)) {
      fs.mkdirSync(dirRegione);
    }

    // Province
    const provinceInRegione = province.filter(
      (x) => x.regione === regione.nome
    );

    fs.writeFileSync(
      dirRegione + "\\provinces.json",
      JSON.stringify(provinceInRegione),
      "utf-8"
    );

    for (const provincia of provinceInRegione) {
      const dirProvincia = path.resolve(
        dirRegione + "\\" + encodeURIComponent(provincia.nome.toLowerCase())
      );
      if (!fs.existsSync(dirProvincia)) {
        fs.mkdirSync(dirProvincia);
      }

      // Comuni
      const comuniInProvincia = comuni.filter(
        (x) => x.provincia === provincia.nome
      );

      fs.writeFileSync(
        dirProvincia + "\\towns.json",
        JSON.stringify(comuniInProvincia),
        "utf-8"
      );
    }
  }

  console.log("Exporting files completed");
};
