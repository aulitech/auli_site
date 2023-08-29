import { get, set } from "idb-keyval";

export default function DirAccess() {
  const getDirectory = async() => {
    try {
      const dirHandleOrUndefined = await get('directory');

      if (dirHandleOrUndefined !== 'undefined') {
        console.log("retrieved dir handle:", dirHandleOrUndefined.name);
        return;
      }

      const dirHandle = await window.showDirectoryPicker({
        id: 'AULI_CATO',
        mode: 'readwrite'
      });

      await set('directory', dirHandle);
      console.log('store dir handle:', dirHandle.name);
    }
    catch(error) {
      console.log("get directory error:", error);
    }
  }

  return getDirectory();
} 