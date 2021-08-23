import axios from "axios";
import moment from "moment";
export default class ApiCall {
  static async getVilles() {
    try {
      const villes = await axios.get(`${process.env.REACT_APP_API_URL}villes`);
      return villes.data.villes;
    } catch (error) {
      console.log(error);
    }
  }
  static async getTarifs() {
    try {
      const tarifs = await axios.get(`${process.env.REACT_APP_API_URL}tarifs`);
      return tarifs.data.result;
    } catch (error) {
      console.log(error);
    }
  }
  static async getRecus(ville_id, from_date, to_date) {
    try {
      const date_from = moment(from_date).format("YYYY-MM-DD 00:00:00");
      const date_to = moment(to_date).format("YYYY-MM-DD 23:59:59");
      const recus = await axios.post(
        `${process.env.REACT_APP_API_URL}recus/${ville_id}`,
        {
          date_from: date_from,
          date_to: date_to,
        }
      );
      return recus.data.result;
    } catch (error) {
      console.log(error);
    }
  }
  static async getMouvements(from_date, to_date) {
    try {
      const date_from = moment(from_date).format("YYYY-MM-DD 00:00:00");
      const date_to = moment(to_date).format("YYYY-MM-DD 23:59:59");
      const mouvements = await axios.post(
        `${process.env.REACT_APP_API_URL}mouvements`,
        {
          date_from: date_from,
          date_to: date_to,
        }
      );
      return mouvements.data.result;
    } catch (error) {
      console.log(error);
    }
  }
  static async getStatistiques(interval) {
    try {
      const recus = await axios.get(
        `${process.env.REACT_APP_API_URL}statistic/${interval}`
      );
      return recus.data;
    } catch (error) {
      console.log(error);
    }
  }
}
