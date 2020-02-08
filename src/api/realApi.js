
import { ApiService } from './serviceFactory';

export default class Api {
  static async getYearAvg(year) {
    const response = await ApiService.get(`/measures/get-year/${year}`);
    return response.measures;
  }
}
