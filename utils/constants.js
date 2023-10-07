import { siteUrl } from "@config/index";

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
            rssFeed: "https://www.culturacardedeu.com/rss.xml",
            descriptionSelector: "#description",
            imageSelector: "#image",
            locationSelector: "#location a",
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
          "sant-pere-vilamajor",
          {
            label: "Sant Pere de Vilamajor",
            rssFeed: "https://www.vilamajor.cat/rss/12/0/",
            descriptionSelector: ".ddbbtext",
            imageSelector: ".first-image",
            postalCode: "08458",
          },
        ],
        [
          "santa-maria-palautordera",
          {
            label: "Santa Maria de Palautordera",
            rssFeed: "https://www.smpalautordera.cat/rss/12/0/",
            descriptionSelector: ".ddbbtext",
            imageSelector: ".first-image",
            postalCode: "08460",
          },
        ],
        [
          "sant-esteve-palautordera",
          {
            label: "Sant Esteve de Palautordera",
            rssFeed: "https://www.santestevedepalautordera.cat/rss/12/0/",
            descriptionSelector: ".ddbbtext",
            imageSelector: ".first-image",
            postalCode: "08461",
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
            rssFeed: `${siteUrl}/api/scrapeEvents?city=granollers`,
            descriptionSelector: ".body-text",
            imageSelector: ".foto a",
            postalCode: "08400",
          },
        ],
      ]),
    },
  ],
  [
    "valles-occidental",
    {
      label: "Vallès Occidental",
      towns: new Map([
        [
          "martorelles",
          {
            label: "Martorelles",
            rssFeed: "https://www.martorelles.cat/rss/12/0/",
            descriptionSelector: ".ddbbtext",
            imageSelector: ".first-image",
            postalCode: "08107",
          },
        ],
      ]),
    },
  ],
]);
