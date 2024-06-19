import { siteUrl } from "@config/index";

const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const vallesOriental = [
  "valles-oriental",
  {
    label: "Vallès Oriental",
    province: "barcelona",
    towns: new Map([
      [
        "cardedeu",
        {
          label: "Cardedeu",
          rssFeed: "https://www.culturacardedeu.com/rss.xml?until=60",
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
          ...sharedData,
          postalCode: "08450",
          coords: { lat: 41.640555555556, lng: 2.4022222222222 },
        },
      ],
      [
        "canoves",
        {
          label: "Cànoves i Samalús",
          rssFeed: "https://www.canovesisamalus.cat/rss/15/0/",
          ...sharedData,
          postalCode: "08445",
          coords: { lat: 41.693778, lng: 2.349269 },
        },
      ],
      [
        "montmelo",
        {
          label: "Montmeló",
          rssFeed: "https://www.montmelo.cat/rss/12",
          postalCode: "08160",
          coords: { lat: 41.551526513055, lng: 2.24819603950155 },
          ...sharedData,
        },
      ],
      [
        "llissa-de-vall",
        {
          label: "Lliçà de Vall",
          rssFeed: "https://www.llissadevall.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08185",
          coords: { lat: 41.583186, lng: 2.239658 },
        },
      ],
      [
        "sant-antoni-vilamajor",
        {
          label: "Sant Antoni de Vilamajor",
          rssFeed: "https://www.santantonidevilamajor.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08459",
          coords: { lat: 41.672559, lng: 2.399991 },
        },
      ],
      [
        "sant-pere-vilamajor",
        {
          label: "Sant Pere de Vilamajor",
          rssFeed: "https://www.vilamajor.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08458",
          coords: { lat: 41.68556, lng: 2.390001 },
        },
      ],
      [
        "santa-maria-palautordera",
        {
          label: "Santa Maria de Palautordera",
          rssFeed: "https://www.smpalautordera.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08460",
          coords: { lat: 41.69528, lng: 2.445832 },
        },
      ],
      [
        "sant-esteve-palautordera",
        {
          label: "Sant Esteve de Palautordera",
          rssFeed: "https://www.santestevedepalautordera.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08461",
          coords: { lat: 41.70528, lng: 2.435833 },
        },
      ],
      [
        "parets-del-valles",
        {
          label: "Parets del Vallès",
          rssFeed: "https://www.parets.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08150",
          coords: { lat: 41.57481, lng: 2.23306 },
        },
      ],
      [
        "sant-feliu-de-codines",
        {
          label: "Sant Feliu de Codines",
          rssFeed: "https://www.santfeliudecodines.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08182",
          coords: { lat: 41.69, lng: 2.165 },
        },
      ],
      [
        "caldes-de-montbui",
        {
          label: "Caldes de Montbui",
          rssFeed: "https://www.caldesdemontbui.cat/rss/28/0/",
          ...sharedData,
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
      [
        "ametlla-del-valles",
        {
          label: "L'Ametlla del Vallès",
          rssFeed: "https://www.ametlla.cat/rss/12",
          ...sharedData,
          postalCode: "08480",
          coords: { lat: 41.668325, lng: 2.260501 },
        },
      ],
      [
        "figaro-montmany",
        {
          label: "Figaró-Montmany",
          rssFeed: "https://www.figaro-montmany.cat/rss/12",
          ...sharedData,
          postalCode: "08590",
          coords: { lat: 41.72278, lng: 2.275 },
        },
      ],
      [
        "fogars-de-montclus",
        {
          label: "Fogars de Montclús",
          rssFeed: "https://www.fogarsdemontclus.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08479",
          coords: { lat: 41.72861, lng: 2.44444 },
        },
      ],
      [
        "la-llagosta",
        {
          label: "La Llagosta",
          rssFeed: "https://www.llagosta.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08120",
          coords: { lat: 41.668325, lng: 2.260501 },
        },
      ],
      [
        "martorelles",
        {
          label: "Martorelles",
          rssFeed: "https://www.martorelles.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08107",
          coords: { lat: 41.53148, lng: 2.23889 },
        },
      ],
      [
        "montseny",
        {
          label: "Montseny",
          rssFeed: "https://www.montseny.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08460",
          coords: { lat: 41.75, lng: 2.395 },
        },
      ],
      [
        "sant-fost-de-campsentelles",
        {
          label: "Sant Fost de Campsentelles",
          rssFeed: "https://www.santfost.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08105",
          coords: { lat: 41.50611, lng: 2.24 },
        },
      ],
      [
        "santa-maria-de-martorelles",
        {
          label: "Santa Maria de Martorelles",
          rssFeed: "https://www.santamariademartorelles.cat/rss/12",
          ...sharedData,
          postalCode: "08106",
          coords: { lat: 41.5167, lng: 2.25 },
        },
      ],
      [
        "vallgorguina",
        {
          label: "Vallgorguina",
          rssFeed: "https://www.vallgorguina.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08471",
          coords: { lat: 41.647738, lng: 2.510201 },
        },
      ],
      [
        "vallromanes",
        {
          label: "Vallromanes",
          rssFeed: "https://www.vallromanes.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08188",
          coords: { lat: 41.53389, lng: 2.44222 },
        },
      ],
      [
        "vilalba-sasserra",
        {
          label: "Vilalba Sasserra",
          rssFeed: "https://www.vilalbasasserra.cat/rss/12",
          ...sharedData,
          postalCode: "08455",
          coords: { lat: 41.65389, lng: 2.44222 },
        },
      ],
      [
        "vilanova-del-valles",
        {
          label: "Vilanova del Vallès",
          rssFeed: "https://www.vilanovadelvalles.cat/rss/12",
          ...sharedData,
          postalCode: "08410",
          coords: { lat: 41.53389, lng: 2.44222 },
        },
      ],
      [
        "bigues-i-riells",
        {
          label: "Bigues i Riells",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=bigues-i-riells`,
          postalCode: "08415",
          coords: { lat: 41.67657584479664, lng: 2.2255734222191146 },
          getDescriptionFromRss: true,
        },
      ],
      [
        "la-roca-del-valles",
        {
          label: "La Roca del Vallès",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=la-roca-del-valles`,
          postalCode: "08430",
          coords: { lat: 41.58583538424762, lng: 2.3264763420486925 },
          getDescriptionFromRss: true,
        },
      ],
    ]),
  },
];
export default vallesOriental;
