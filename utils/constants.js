import {
  barcelones,
  osona,
  selva,
  baixLlobregat,
  altEmporda,
  anoia,
  bages,
  llucanes,
  altPenedes,
  garraf,
  maresme,
  vallesOccidental,
  vallesOriental,
  baixEmporda,
  bergueda,
  moianes,
  urgell,
  tarragones,
} from "@utils/cities";

export const MAX_RESULTS = 15;

export const DAYS = [
  "Diumenge",
  "Dilluns",
  "Dimarts",
  "Dimecres",
  "Dijous",
  "Divendres",
  "Dissabte",
];

export const MONTHS = [
  "gener",
  "febrer",
  "març",
  "abril",
  "maig",
  "juny",
  "juliol",
  "agost",
  "setembre",
  "octubre",
  "novembre",
  "desembre",
];

export const MONTHS_URL = [
  "gener",
  "febrer",
  "marc",
  "abril",
  "maig",
  "juny",
  "juliol",
  "agost",
  "setembre",
  "octubre",
  "novembre",
  "desembre",
];

export const CATEGORIES = {
  "Festes Majors": "Festa Major",
  Festivals: "Festival",
  Familiar: "Familiar",
  Música: "Música",
  Cinema: "Cinema",
  Teatre: "Teatre",
  Exposicions: "Exposició",
  Fires: "Fira",
  Espectacles: "Espectacles",
};

export const SEARCH_TERMS_SUBSET = [
  "Festa Major",
  "Festival",
  "Familiar",
  "Música",
];

export const CATEGORY_NAMES_MAP = Object.fromEntries(
  Object.entries(CATEGORIES).map(([displayName, searchTerm]) => [
    searchTerm,
    displayName,
  ])
);

export const BYDATES = [
  { value: "avui", label: "Avui" },
  { value: "dema", label: "Demà" },
  { value: "cap-de-setmana", label: "Cap de setmana" },
  { value: "setmana", label: "Aquesta setmana" },
];

export const dateFunctions = {
  avui: "today",
  dema: "tomorrow",
  setmana: "week",
  "cap-de-setmana": "weekend",
};

export const DISTANCES = [1, 5, 10, 30, 50];

export const CITIES_DATA = new Map([
  barcelones,
  osona,
  selva,
  baixLlobregat,
  altEmporda,
  anoia,
  bages,
  llucanes,
  altPenedes,
  garraf,
  maresme,
  vallesOccidental,
  vallesOriental,
  baixEmporda,
  bergueda,
  moianes,
  urgell,
  tarragones,
]);
