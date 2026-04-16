import * as IconifyVue from "@iconify/vue";
import mdiCollection from "@iconify-json/mdi/icons.json";

let mdiCollectionRegistered = false;

export const LOCAL_MDI_COLLECTION = mdiCollection;

export function registerLocalMdiCollection() {
  if (mdiCollectionRegistered || typeof IconifyVue.addCollection !== "function") {
    return;
  }

  IconifyVue.addCollection(LOCAL_MDI_COLLECTION);
  mdiCollectionRegistered = true;
}
