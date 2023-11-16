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

export const CATEGORIES = {
  Familiar: "Familiar",
  Música: "Música",
  Cinema: "Cinema",
  Teatre: "Teatre",
  Exposicions: "Exposició",
  Fires: "Fira",
  Espectacles: "Espectacles",
  "Festa Major": "Festa Major",
};

export const BYDATES = [
  { value: "avui", label: "Avui" },
  { value: "setmana", label: "Aquesta setmana" },
  { value: "cap-de-setmana", label: "Cap de setmana" },
];

export const dateFunctions = {
  avui: "today",
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
          },
        ],
      ]),
    },
  ],
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
            coords: { lat: 41.6398, lng: 2.3574 },
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
            coords: { lat: 41.640555555556, lng: 2.4022222222222 },
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
            coords: { lat: 41.693778, lng: 2.349269 },
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
            coords: { lat: 41.583186, lng: 2.239658 },
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
            coords: { lat: 41.672559, lng: 2.399991 },
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
            coords: { lat: 41.68556, lng: 2.390001 },
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
            coords: { lat: 41.69528, lng: 2.445832 },
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
            coords: { lat: 41.70528, lng: 2.435833 },
          },
        ],
        [
          "parets-del-valles",
          {
            label: "Parets del Vallès",
            rssFeed: "https://www.parets.cat/rss/12/0/",
            descriptionSelector: ".ddbbtext",
            imageSelector: ".first-image",
            postalCode: "08150",
            coords: { lat: 41.57481, lng: 2.23306 },
          },
        ],
        [
          "sant-feliu-de-codines",
          {
            label: "Sant Feliu de Codines",
            rssFeed: "https://www.santfeliudecodines.cat/rss/12/0/",
            descriptionSelector: ".ddbbtext",
            imageSelector: ".first-image",
            postalCode: "08182",
            coords: { lat: 41.69, lng: 2.165 },
          },
        ],
        [
          "caldes-de-montbui",
          {
            label: "Caldes de Montbui",
            rssFeed: "https://www.caldesdemontbui.cat/rss/28/0/",
            descriptionSelector: ".ddbbtext",
            imageSelector: ".first-image",
            postalCode: "08140",
            coords: { lat: 41.63111, lng: 2.16867 },
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
            coords: { lat: 41.680381, lng: 2.28334 },
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
            coords: { lat: 41.60619270000001, lng: 2.287088899999958 },
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
            coords: { lat: 41.5321, lng: 0.236 },
          },
        ],
      ]),
    },
  ],
]);
