import { siteUrl } from "@config/index";
import {
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
  [
    "barcelones",
    {
      label: "Barcelonès",
      towns: new Map([
        [
          "barcelona",
          {
            label: "Barcelona",
            rssFeed: `${siteUrl}/api/scrapeWebsite`,
            descriptionSelector: ".cos",
            imageSelector: ".img-destacada",
            postalCode: "08001",
            coords: { lat: 41.390205, lng: 2.154007 },
            sanitizeUrl: true,
            getDescriptionFromRss: true,
          },
        ],
      ]),
    },
  ],
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
]);
