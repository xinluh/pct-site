import { unzip } from 'unzipit';
import { kml } from 'togeojson';

// adapted from https://github.com/victorLessa/parse2-kmz/blob/master/index.js to run in browser
const fetchKmzData = async () => {
  const response = await unzip('/2018_PCT.kmz');
  // console.log('response', response);
  const xml = await response.entries['2018_PCT.kml'].text();
  const xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');
  return kml(xmlDoc);
};

export default fetchKmzData;
