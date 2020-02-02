
import { ApiService } from './serviceFactory';

export default class Api {
  static async getYearAvg(source, year) {
    const response = await ApiService.get(`/measures/get-year`);
    return response.measures;
  }
}
