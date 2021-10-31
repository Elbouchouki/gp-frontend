import axios from "axios";
import moment from "moment";
export default class ApiCall {
  static async getDates(token, active, from_date, to_date) {
    try {
      const date_from = moment(from_date).format("YYYY-MM-DD");
      const date_to = moment(to_date).format("YYYY-MM-DD");
      const dates = await axios.post(
        `${process.env.REACT_APP_API_URL}excel/dates`,
        {
          date_from: date_from,
          date_to: date_to,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return dates.data;
    } catch (error) {
      console.log(error);
    }
  }
  static async getExcelData(
    token,
    active,
    ville_id,
    date_from,
    date_to,
    hour_from,
    hour_to,
    is_hour,
    hour_type
  ) {
    const date_f = moment(date_from).format("YYYY-MM-DD");
    const date_t = moment(date_to).format("YYYY-MM-DD");
    const hour_f = moment(hour_from).format("HH:mm");
    const hour_t = moment(hour_to).format("HH:mm");
    try {
      const excelData = await axios.post(
        `${process.env.REACT_APP_API_URL}excel`,
        {
          ville_id: ville_id,
          date_from: date_f,
          date_to: date_t,
          hour_from: hour_f,
          hour_to: hour_t,
          is_hour: is_hour,
          hour_type: hour_type,
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
  static async getOncfData(token, ville, year) {
    try {
      const oncfData = await axios.post(
        `${process.env.REACT_APP_API_URL}excel/oncf`,
        {
          ville_id: ville,
          year: year,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return oncfData.data;
    } catch (error) {
      console.log(error);
    }
  }
  static async getVilleStatistiques(token, active, from_date, to_date) {
    try {
      var date_from = moment(from_date).format("YYYY-MM-DD 00:00:00");
      var date_to = moment(to_date).format("YYYY-MM-DD 23:59:59");
      if (active === "yesterday") {
        date_from = moment().subtract(1, "days").format("YYYY-MM-DD 00:00:00");
        date_to = moment().subtract(1, "days").format("YYYY-MM-DD 23:59:59");
      }
      if (active === "day") {
        date_from = moment().format("YYYY-MM-DD 00:00:00");
        date_to = moment().format("YYYY-MM-DD 23:59:59");
      }
      const villeStatistiques = await axios.post(
        `${process.env.REACT_APP_API_URL}excel/ville`,
        {
          date_from: date_from,
          date_to: date_to,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return villeStatistiques.data.result;
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
  static async getTarifs(token, type) {
    try {
      const tarifs = await axios.get(
        `${process.env.REACT_APP_API_URL}tarifs/${type}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return tarifs.data.result;
    } catch (error) {
      console.log(error);
    }
  }
  static async getArticles(token, type) {
    try {
      const articles = await axios.get(
        `${process.env.REACT_APP_API_URL}articles/${type}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return articles.data.result;
    } catch (error) {
      console.log(error);
    }
  }
  static async getRecus(token, active, article, from_date, to_date) {
    try {
      var date_from = moment(from_date).format("YYYY-MM-DD 00:00:00");
      var date_to = moment(to_date).format("YYYY-MM-DD 23:59:59");
      if (active === "free") {
        date_from = moment(from_date).format("YYYY-MM-DD HH:mm");
        date_to = moment(to_date).format("YYYY-MM-DD HH:mm");
      }
      const recus = await axios.post(
        `${process.env.REACT_APP_API_URL}recus`,
        {
          article_id: article,
          date_from: date_from,
          date_to: date_to,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return recus.data.result;
    } catch (error) {
      console.log(error);
    }
  }
  static async getBilans(token, active, from_date, to_date) {
    try {
      var date_from = moment(from_date).format("YYYY-MM-DD 00:00:00");
      var date_to = moment(to_date).format("YYYY-MM-DD 23:59:59");
      if (active === "free") {
        date_from = moment(from_date).format("YYYY-MM-DD HH:mm");
        date_to = moment(to_date).format("YYYY-MM-DD HH:mm");
      }
      const bilans = await axios.post(
        `${process.env.REACT_APP_API_URL}bilans`,
        {
          date_from: date_from,
          date_to: date_to,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return bilans.data.result;
    } catch (error) {
      console.log(error);
    }
  }
  static async getMouvements(token, active, from_date, to_date) {
    try {
      var date_from = moment(from_date).format("YYYY-MM-DD 00:00:00");
      var date_to = moment(to_date).format("YYYY-MM-DD 23:59:59");
      if (active === "free") {
        date_from = moment(from_date).format("YYYY-MM-DD HH:mm");
        date_to = moment(to_date).format("YYYY-MM-DD HH:mm");
      }
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
  static async getStatistiquesCustom(token, from_date, to_date) {
    try {
      const date_from = moment(from_date).format("YYYY-MM-DD 00:00:00");
      const date_to = moment(to_date).format("YYYY-MM-DD 23:59:59");
      const statisticCustom = await axios.post(
        `${process.env.REACT_APP_API_URL}statistic`,
        {
          date_from: date_from,
          date_to: date_to,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return statisticCustom.data;
    } catch (error) {
      console.log(error);
    }
  }
  static async traffic(token, ville_id, from_date, to_date) {
    try {
      const date_from = moment(from_date).format("YYYY-MM-DD 00:00:00");
      const date_to = moment(to_date).format("YYYY-MM-DD 23:59:59");
      const traffic = await axios.post(
        `${process.env.REACT_APP_API_URL}statistic/traffic`,
        {
          ville_id: ville_id,
          date_from: date_from,
          date_to: date_to,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return traffic.data;
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
