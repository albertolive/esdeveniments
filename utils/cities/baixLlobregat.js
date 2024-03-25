const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const selva = [
  "baix-llobregat",
  {
    label: "Baix Llobregat",
    towns: new Map([
      [
        "begues",
        {
          label: "Begues",
          postalCode: "08859",
          coords: { lat: 41.3331, lng: 1.9128 },
          rssUrl: "https://www.begues.cat/rss/12/0/",
          ...sharedData,
        },
      ],
      [
        "castellvi-de-rosanes",
        {
          label: "Castellví de Rosanes",
          postalCode: "08769",
          coords: { lat: 41.4294, lng: 1.8625 },
          rssUrl: "https://www.castellviderosanes.cat/rss/12",
          ...sharedData,
        },
      ],
      [
        "cervello",
        {
          label: "Cervelló",
          postalCode: "08758",
          coords: { lat: 41.3667, lng: 1.9667 },
          rssUrl: "https://www.cervello.cat/rss/12/0/",
          ...sharedData,
        },
      ],
      [
        "la-palma-de-cervello",
        {
          label: "La Palma de Cervelló",
          postalCode: "08756",
          coords: { lat: 41.3667, lng: 1.9167 },
          rssUrl: "https://www.lapalmadecervello.cat/feeds/agenda",
          ...sharedData,
        },
      ],
      [
        "santa-coloma-de-cervello",
        {
          label: "Santa Coloma de Cervelló",
          postalCode: "08690",
          coords: { lat: 41.3667, lng: 1.9333 },
          rssUrl: "https://www.santacolomadecervello.cat/rss/12",
          ...sharedData,
        },
      ],
      [
        "sant-climent-de-llobregat",
        {
          label: "Sant Climent de Llobregat",
          postalCode: "08689",
          coords: { lat: 41.3833, lng: 1.9167 },
          rssUrl: "https://www.santclimentdellobregat.cat/rss/12",
          ...sharedData,
        },
      ],
      [
        "sant-esteve-sesrovires",
        {
          label: "Sant Esteve Sesrovires",
          postalCode: "08635",
          coords: { lat: 41.4833, lng: 1.8833 },
          rssUrl: "https://www.sesrovires.cat/rss/12/0",
          ...sharedData,
        },
      ],
      [
        "torrelles-de-llobregat",
        {
          label: "Torrelles de Llobregat",
          postalCode: "08629",
          coords: { lat: 41.3667, lng: 1.9667 },
          rssUrl: "https://www.torrelles.cat/rss/12",
          ...sharedData,
        },
      ],
      [
        "vallirana",
        {
          label: "Vallirana",
          postalCode: "08759",
          coords: { lat: 41.3833, lng: 1.9167 },
          rssUrl: "https://www.vallirana.cat/rss/12",
          ...sharedData,
        },
      ],
    ]),
  },
];

export default selva;
