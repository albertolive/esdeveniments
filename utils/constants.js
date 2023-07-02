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

export const TAGS = [
  "Familiar",
  "Tertúlia Literària",
  "Vermut",
  "Cinema",
  "Concert",
  "Teatre",
  "Exposició",
];

export const BYDATES = [
  // Replace it with a dynamic data source
  { value: "avui", label: "Avui" },
  { value: "setmana", label: "Aquesta setmana" },
  { value: "cap-de-setmana", label: "Cap de setmana" },
];

export const CITIES_DATA = new Map([
  [
    "valles-oriental",
    {
      label: "Vallès Oriental",
      towns: new Map([
        [
          "cardedeu",
          {
            label: "Cardedeu",
            rssFeed: "https://www.cardedeu.cat/rss/12/0",
            descriptionSelector: ".ddbbtext",
            imageSelector: ".first-image",
            postalCode: "08440",
          },
        ],
        [
          "llinars",
          {
            label: "Llinars del Vallès",
            rssFeed: "https://www.llinarsdelvalles.cat/rss/12",
            descriptionSelector: ".ddbbtext",
            imageSelector: ".first-image",
            postalCode: "08450",
          },
        ],
        [
          "granollers",
          {
            label: "Granollers",
            rssFeed: "https://www.granollers.cat/rss.xml",
            descriptionSelector: ".categories",
            imageSelector: ".foto",
            postalCode: "08400",
          },
        ],
        [
          "la-garriga",
          {
            label: "La Garriga",
            rssFeed: "http://lagarriga.webmunicipal.diba.cat/rss/12/0",
            descriptionSelector: ".td_justificat",
            imageSelector: ".justified-gallery",
            postalCode: "08530",
          },
        ],
        // Add more towns with their respective RSS feed URLs
      ]),
    },
  ],
  // Add more regions with their respective towns and data
]);
