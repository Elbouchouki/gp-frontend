export const listMouvs = [
  {
    value: 1,
    label: "Entrée en bras cassé",
    type: "Entrées",
  },
  {
    value: 2,
    label: "Entrée en manuel",
    type: "Entrées",
  },
  {
    value: 3,
    label: "Sortie en ouv.maint",
    type: "Sorties",
  },
];
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
      return "Journalières";
    case "week":
      return "Hebdomadaire";
    case "month":
      return "Mentuelles";
    case "year":
      return "Annuelles";
    default:
      return "Personnalisé";
  }
};
export const getVille = (villeId) => {
  switch (villeId) {
    case 1:
      return "Marrakech";
    case 2:
      return "Casablanca";
    case 3:
      return "Mohammedia";
    case 4:
      return "Fes";
    case 5:
      return "Salé";
    default:
      return "Ville";
  }
};
export const getVilles = (villeId) => {
  var ville = "";
  villeId.forEach((element) => (ville += getVille(element) + " "));
  return ville;
};
export const monthFullSwitch = (month) => {
  switch (month) {
    case 1:
      return "Janvier";
    case 2:
      return "Fevrier";
    case 3:
      return "Mars";
    case 4:
      return "Avril";
    case 5:
      return "Mai";
    case 6:
      return "Juin";
    case 7:
      return "Juillet";
    case 8:
      return "Aout";
    case 9:
      return "Septembre";
    case 10:
      return "Octobre";
    case 11:
      return "Novembre";
    case 12:
      return "Decembre";
    default:
      return "Mois";
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
export const tarificationAbonne = [100, 120, 220];
