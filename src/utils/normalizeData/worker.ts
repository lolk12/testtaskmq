import { normalizeData } from './normalizeData';

onmessage = async ({ data }) => {
  postMessage(normalizeData(data));
  close();
};

export {};
