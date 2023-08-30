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

export const dateFunctions = {
  avui: "today",
  setmana: "week",
  "cap-de-setmana": "weekend",
};

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
            locationSelector: "ddbbtext",
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
          "canoves",
          {
            label: "Cànoves i Samalús",
            rssFeed: "https://www.canovesisamalus.cat/rss/15/0/",
            descriptionSelector: ".ddbbtext",
            imageSelector: ".first-image",
            postalCode: "08445",
          },
        ],
        [
          "llissa-de-vall",
          {
            label: "Lliçà de Vall",
            rssFeed: "https://www.llissadevall.cat/rss/12/0/",
            descriptionSelector: ".ddbbtext",
            imageSelector: ".first-image",
            postalCode: "08185",
          },
        ],
        [
          "sant-antoni-vilamajor",
          {
            label: "Sant Antoni de Vilamajor",
            rssFeed: "https://www.santantonidevilamajor.cat/rss/12/0/",
            descriptionSelector: ".ddbbtext",
            imageSelector: ".first-image",
            postalCode: "08459",
          },
        ],
        [
          "la-garriga",
          {
            label: "La Garriga",
            rssFeed: "http://lagarriga.webmunicipal.diba.cat/rss/12/0",
            descriptionSelector: ".text-maquetat",
            imageSelector: ".justified-gallery",
            locationSelector: ".td_justificat",
            postalCode: "08530",
          },
        ],
        [
          "granollers",
          {
            label: "Granollers",
            rssFeed: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/scrapeEvents?city=granollers`,
            descriptionSelector: ".body-text",
            imageSelector: ".foto a",
            postalCode: "08400",
          },
        ],
        // [
        //   "turisme-valles",
        //   {
        //     hide: true,
        //     label: "Turisme Vallès",
        //     rssFeed: "https://www.turismevalles.com/events/feed/",
        //     descriptionSelector: ".mec-event-content",
        //     imageSelector: ".mec-events-event-image",
        //     postalCode: "",
        //   },
        // ],
        // Add more towns with their respective RSS feed URLs
      ]),
    },
  ],
  // Add more regions with their respective towns and data
]);
