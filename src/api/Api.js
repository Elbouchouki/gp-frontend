import axios from "axios";
import moment from "moment";
export default class ApiCall {
  static async getExcelData(token, list_ville, from_date, to_date) {
    try {
      const date_from = moment(from_date).format("YYYY-MM-DD");
      const date_to = moment(to_date).format("YYYY-MM-DD");
      const excelData = await axios.post(
        `${process.env.REACT_APP_API_URL}excel`,
        {
          list_ville: list_ville,
          date_from: date_from,
          date_to: date_to,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return excelData.data;
    } catch (error) {
      console.log(error);
    }
  }
  static async getVilles(token) {
    try {
      const villes = await axios.get(`${process.env.REACT_APP_API_URL}villes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return villes.data.villes;
    } catch (error) {
      console.log(error);
    }
  }
  static async getTarifs(token) {
    try {
      const tarifs = await axios.get(`${process.env.REACT_APP_API_URL}tarifs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return tarifs.data.result;
    } catch (error) {
      console.log(error);
    }
  }
  static async getRecus(token, ville_id, from_date, to_date) {
    try {
      const date_from = moment(from_date).format("YYYY-MM-DD 00:00:00");
      const date_to = moment(to_date).format("YYYY-MM-DD 23:59:59");
      const recus = await axios.post(
        `${process.env.REACT_APP_API_URL}recus/${ville_id}`,
        {
          date_from: date_from,
          date_to: date_to,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(recus.data);
      return recus.data.result;
    } catch (error) {
      console.log(error);
    }
  }
  static async getMouvements(token, from_date, to_date) {
    try {
      const date_from = moment(from_date).format("YYYY-MM-DD 00:00:00");
      const date_to = moment(to_date).format("YYYY-MM-DD 23:59:59");
      const mouvements = await axios.post(
        `${process.env.REACT_APP_API_URL}mouvements`,
        {
          date_from: date_from,
          date_to: date_to,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return mouvements.data.result;
    } catch (error) {
      console.log(error);
    }
  }
  static async getStatistiques(token, interval) {
    try {
      const statistics = await axios.get(
        `${process.env.REACT_APP_API_URL}statistic/${interval}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return statistics.data;
    } catch (error) {
      console.log(error);
    }
  }
  static async getRoles(token) {
    try {
      const roles = await axios.get(
        `${process.env.REACT_APP_API_URL}role_permission/roles`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return roles.data;
    } catch (error) {
      console.log(error);
    }
  }
  static async getUsers(token) {
    try {
      const users = await axios.get(`${process.env.REACT_APP_API_URL}users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return users.data;
    } catch (error) {
      console.log(error);
    }
  }
  static async deleteUsers(token, username) {
    try {
      const user = await axios.delete(`${process.env.REACT_APP_API_URL}users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          username: username,
        },
      });
      return user.data;
    } catch (error) {
      console.log(error);
    }
  }
  static async updateUsers(token, userInfo) {
    try {
      const user = await axios.put(
        `${process.env.REACT_APP_API_URL}users`,
        userInfo,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return user.data;
    } catch (error) {
      console.log(error);
    }
  }
  static async addUsers(token, userInfo) {
    try {
      const user = await axios.post(
        `${process.env.REACT_APP_API_URL}users`,
        userInfo,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return user.data;
    } catch (error) {
      console.log(error);
    }
  }
}
