const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const baixLlobregat = [
  "baix-llobregat",
  {
    label: "Baix Llobregat",
    province: "barcelona",
    towns: new Map([
      [
        "begues",
        {
          label: "Begues",
          rssFeed: "https://www.begues.cat/rss/12/0/",
          postalCode: "08859",
          coords: { lat: 41.3331, lng: 1.9128 },
          ...sharedData,
        },
      ],
      [
        "castellvi-de-rosanes",
        {
          label: "Castellví de Rosanes",
          rssFeed: "https://www.castellviderosanes.cat/rss/12",
          postalCode: "08769",
          coords: { lat: 41.4294, lng: 1.8625 },
          ...sharedData,
        },
      ],
      [
        "cervello",
        {
          label: "Cervelló",
          rssFeed: "https://www.cervello.cat/rss/12/0/",
          postalCode: "08758",
          coords: { lat: 41.3667, lng: 1.9667 },
          ...sharedData,
        },
      ],
      [
        "la-palma-de-cervello",
        {
          label: "La Palma de Cervelló",
          rssFeed: "https://www.lapalmadecervello.cat/feeds/agenda",
          postalCode: "08756",
          coords: { lat: 41.3667, lng: 1.9167 },
          ...sharedData,
        },
      ],
      [
        "santa-coloma-de-cervello",
        {
          label: "Santa Coloma de Cervelló",
          rssFeed: "https://www.santacolomadecervello.cat/rss/12",
          postalCode: "08690",
          coords: { lat: 41.3667, lng: 1.9333 },
          ...sharedData,
        },
      ],
      [
        "sant-climent-de-llobregat",
        {
          label: "Sant Climent de Llobregat",
          rssFeed: "https://www.santclimentdellobregat.cat/rss/12",
          postalCode: "08689",
          coords: { lat: 41.3833, lng: 1.9167 },
          ...sharedData,
        },
      ],
      [
        "sant-esteve-sesrovires",
        {
          label: "Sant Esteve Sesrovires",
          rssFeed: "https://www.sesrovires.cat/rss/12/0",
          postalCode: "08635",
          coords: { lat: 41.4833, lng: 1.8833 },
          ...sharedData,
        },
      ],
      [
        "torrelles-de-llobregat",
        {
          label: "Torrelles de Llobregat",
          rssFeed: "https://www.torrelles.cat/rss/12",
          postalCode: "08629",
          coords: { lat: 41.3667, lng: 1.9667 },
          ...sharedData,
        },
      ],
      [
        "vallirana",
        {
          label: "Vallirana",
          rssFeed: "https://www.vallirana.cat/rss/12",
          postalCode: "08759",
          coords: { lat: 41.3833, lng: 1.9167 },
          ...sharedData,
        },
      ],
    ]),
  },
];

export default baixLlobregat;
