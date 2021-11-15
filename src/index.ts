import { fetchFromApi } from "./istat/istat";
import { exportAsJson } from "./utils/export-jsons";

(async function () {
  try {
    const { regioni, province, comuni } = await fetchFromApi();
    await exportAsJson(regioni, province, comuni);
  } catch (e) {
    console.error(e);
  }
})();
