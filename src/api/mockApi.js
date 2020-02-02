// import pulseData from './dataLake/pulse.json'
import uradData from './dataLake/urad.json'

export default class Api {
  static async getYearAvg(source, year) {
    const response = await withDelay(uradData);
    return response;
  }

  static async getTopMasurements(source, year) {
    const response = await withDelay(uradData);
    return response;
  }
}

export function withDelay(data, delay = 1) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay * 1000);
  })
}

