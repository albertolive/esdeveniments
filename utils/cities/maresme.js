import { siteUrl } from "@config/index";

const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const maresme = [
  "maresme",
  {
    label: "Maresme",
    towns: new Map([
      [
        "alella",
        {
          label: "Alella",
          rssFeed: "https://alella.cat/a.php?fer=SINDICACIO&seccio=2",
          descriptionSelector: ".cos",
          imageSelector: ".div_ia.imatge_associada2 img",
          postalCode: "08328",
          coords: { lat: "41.4938", lng: "2.2945" },
          removeImage: true,
        },
      ],
      [
        "arenys-de-mar",
        {
          label: "Arenys de Mar",
          rssFeed: "https://arenysdemar.cat/a.php?fer=SINDICACIO&seccio=2",
          descriptionSelector: ".cos",
          imageSelector: ".imatge_associada2",
          postalCode: "08350",
          coords: { lat: "41.5819", lng: "2.54936" },
          removeImage: true,
        },
      ],
      [
        "arenys-de-munt",
        {
          label: "Arenys de Munt",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=arenys-de-munt`,
          postalCode: "08358",
          coords: { lat: "41.60897309259838", lng: "2.540454175884264" },
          getDescriptionFromRss: true,
        },
      ],
      [
        "argentona",
        {
          label: "Argentona",
          rssFeed: "https://argentona.cat/a.php?fer=SINDICACIO&seccio=2",
          descriptionSelector: ".cos",
          postalCode: "08310",
          coords: { lat: "41.5534", lng: "2.4035" },
          removeImage: true, // TODO: fix this
        },
      ],
      [
        "cabrera-de-mar",
        {
          label: "Cabrera de Mar",
          rssFeed: "https://www.cabrerademar.cat/feeds/agenda",
          descriptionSelector: ".brcm-event-detail-column-left",
          imageSelector: ".brcm-image",
          postalCode: "08349",
          coords: { lat: "41.5534", lng: "2.4035" },
        },
      ],
      [
        "caldes-d-estrac",
        {
          label: "Caldes d'Estrac",
          rssFeed: "https://caldetes.cat/a.php?fer=SINDICACIO&seccio=2",
          descriptionSelector: ".cos",
          postalCode: "08393",
          coords: { lat: "41.57194", lng: "2.52861" },
          removeImage: true, // TODO: fix this
        },
      ],
      [
        "calella",
        {
          label: "Calella",
          rssFeed: "https://www.calella.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08370",
          coords: { lat: "41.57194", lng: "2.52861" },
        },
      ],
      [
        "canet-de-mar",
        {
          label: "Canet de Mar",
          rssFeed: "https://www.canetdemar.cat/a.php?fer=SINDICACIO&seccio=2",
          descriptionSelector: ".cos",
          postalCode: "08360",
          coords: { lat: "41.5905", lng: "2.5812" },
          removeImage: true,
        },
      ],
      [
        "dosrius",
        {
          label: "Dosrius",
          rssFeed: "https://www.dosrius.cat/rss/12",
          ...sharedData,
          postalCode: "08319",
          coords: { lat: "41.594", lng: "2.406" },
        },
      ],
      [
        "el-masnou",
        {
          label: "El Masnou",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=el-masnou`,
          postalCode: "08320",
          coords: { lat: "41.48276608612813", lng: "2.311522588574262" },
          getDescriptionFromRss: true,
        },
      ],
      [
        "malgrat-de-mar",
        {
          label: "Malgrat de Mar",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=malgrat-de-mar`,
          postalCode: "08380",
          coords: { lat: "41.64667346532037", lng: "2.7425516023358285" },
          getDescriptionFromRss: true,
        },
      ],
      [
        "mataro",
        {
          label: "Mataró",
          rssFeed: "https://www.mataro.cat/ca/actualitat/agenda/agenda/rss.xml",
          descriptionSelector: "#parent-fieldname-text",
          imageSelector: ".leadImage",
          postalCode: "08301",
          coords: { lat: "41.533", lng: "2.450" },
          getDescriptionFromRss: true,
        },
      ],
      [
        "montgat",
        {
          label: "Montgat",
          rssFeed: "https://www.montgat.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08390",
          coords: { lat: "41.469", lng: "2.2805" },
        },
      ],
      [
        "orrius",
        {
          label: "Òrrius",
          rssFeed: "https://www.orrius.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08317",
          coords: { lat: "41.55750", lng: "2.35583" },
        },
      ],
      [
        "premia-de-dalt",
        {
          label: "Premià de Dalt",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=premia-de-dalt`,
          postalCode: "08338",
          coords: { lat: "41.505059765326024", lng: "2.3481186212204306" },
          getDescriptionFromRss: true,
        },
      ],
      // [
      //   "palafolls",
      //   {
      //     label: "Palafolls",
      //     rssFeed: "https://www.palafolls.cat/rss/pl3/rss.xml",
      //     ...sharedData,
      //     postalCode: "08389",
      //     coords: { lat: "41.66917", lng: "2.75056" },
      //   },
      // ],
      [
        "sant-andreu-de-llavaneres",
        {
          label: "Sant Andreu de Llavaneres",
          rssFeed: "https://ajllavaneres.cat/a.php?fer=SINDICACIO&seccio=2",
          descriptionSelector: ".cos",
          postalCode: "08392",
          coords: { lat: "41.57333", lng: "2.48278" },
          removeImage: true,
        },
      ],
      [
        "sant-cebria-de-vallalta",
        {
          label: "Sant Cebrià de Vallalta",
          rssFeed: "https://www.stcebria.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08396",
          coords: { lat: "41.62111", lng: "2.60111" },
        },
      ],
      [
        "sant-iscle-de-vallalta",
        {
          label: "Sant Iscle de Vallalta",
          rssFeed: "https://www.santiscle.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08359",
          coords: { lat: "41.62500", lng: "2.57000" },
        },
      ],
      [
        "sant-pol-de-mar",
        {
          label: "Sant Pol de Mar",
          rssFeed: "https://www.santpol.cat/a.php?fer=SINDICACIO&seccio=2",
          descriptionSelector: ".cos",
          postalCode: "08395",
          coords: { lat: "41.60333", lng: "2.62444" },
          removeImage: true, // Image in wrong format, fails app
        },
      ],
      [
        "sant-vicenc-de-montalt",
        {
          label: "Sant Vicenç de Montalt",
          rssFeed: "https://www.svmontalt.cat/a.php?fer=SINDICACIO&seccio=2",
          descriptionSelector: ".cos",
          postalCode: "08394",
          coords: { lat: "41.58028", lng: "2.50861" },
          removeImage: true,
        },
      ],
      [
        "santa-susanna",
        {
          label: "Santa Susanna",
          rssFeed: "https://www.stasusanna.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08398",
          coords: { lat: "41.63694", lng: "2.70806" },
        },
      ],
      [
        "tordera",
        {
          label: "Tordera",
          rssFeed: "https://tordera.webmunicipal.diba.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08490",
          coords: { lat: "41.70083", lng: "2.72000" },
        },
      ],
      [
        "vilassar-de-dalt",
        {
          label: "Vilassar de Dalt",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=vilassar-de-dalt`,
          postalCode: "08339",
          coords: { lat: "41.517176648217394", lng: "2.3583089588685895" },
          getDescriptionFromRss: true,
        },
      ],
      [
        "vilassar-de-mar",
        {
          label: "Vilassar de Mar",
          rssFeed: `${siteUrl}/api/scrapeEvents?city=vilassar-de-mar`,
          postalCode: "08340",
          coords: { lat: "41.50422039690453", lng: "2.3930130407280035" },
          getDescriptionFromRss: true,
        },
      ],
    ]),
  },
];
export default maresme;
