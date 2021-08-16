import axios from "axios";
export default class ApiCall {
  static async getRecus(ville_id, from_date, to_date) {
    try {
      const recus = await axios.get(
        `${process.env.REACT_APP_API_URL}recus/${ville_id}`
      );
      return recus.data.result;
    } catch (error) {
      console.log(error);
    }
  }
}
