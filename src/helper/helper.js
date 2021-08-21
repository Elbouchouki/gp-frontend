export const listTarifs = [
  {
    value: 0,
    label: "0 Dh",
  },
  {
    value: 5,
    label: "5 Dh",
  },
  {
    value: 7,
    label: "7 Dh",
  },
  {
    value: 12,
    label: "12 Dh",
  },
  {
    value: 15,
    label: "15 Dh",
  },
  {
    value: 20,
    label: "20 Dh",
  },
  {
    value: 25,
    label: "25 Dh",
  },
  {
    value: -1,
    label: "Autres",
  },
];
export const seasonSwitch = (season) => {
  switch (season) {
    case "day":
      return "Journalier";
    case "week":
      return "Hebdomadaire";
    case "month":
      return "Mensuel";
    case "year":
      return "Annuel";
    default:
      return "Season";
  }
};
export const monthSwitch = (month) => {
  switch (month) {
    case 1:
      return "Jan";
    case 2:
      return "Fev";
    case 3:
      return "Mar";
    case 4:
      return "Avr";
    case 5:
      return "Mai";
    case 6:
      return "Jui";
    case 7:
      return "Juil";
    case 8:
      return "Aout";
    case 9:
      return "Sep";
    case 10:
      return "Oct";
    case 11:
      return "Nov";
    case 12:
      return "Dec";
    default:
      return "Mois";
  }
};
export const tarification = [0, 5, 7, 12, 15, 20, 25];
