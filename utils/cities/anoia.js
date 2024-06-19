const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const anoia = [
  "anoia",
  {
    label: "Anoia",
    province: "barcelona",
    towns: new Map([
      [
        "el-bruc",
        {
          label: "El Bruc",
          rssFeed: "https://www.bruc.cat/rss/12",
          postalCode: "08294",
          coords: { lat: 41.5806576460171, lng: 1.77979493890376 },
          ...sharedData,
        },
      ],
      [
        "igualada",
        {
          label: "Igualada",
          rssFeed: "https://www.igualada.cat/rss/12",
          postalCode: "08700",
          coords: { lat: 41.5787365230604, lng: 1.61753427064665 },
          ...sharedData,
        },
      ],
      [
        "capellades",
        {
          label: "Capellades",
          rssFeed: "https://www.capellades.cat/rss/12",
          postalCode: "08786",
          coords: { lat: 41.5314261320798, lng: 1.68581363320886 },
          ...sharedData,
        },
      ],
      [
        "carme",
        {
          label: "Carme",
          rssFeed: "https://www.carme.cat/rss/15",
          postalCode: "08787",
          coords: { lat: 41.5309437908663, lng: 1.62301291587614 },
          ...sharedData,
        },
      ],
      [
        "la-llacuna",
        {
          label: "La Llacuna",
          rssFeed: "https://www.lallacuna.cat/rss/12",
          postalCode: "08779",
          coords: { lat: 41.4722099, lng: 1.53378 },
          ...sharedData,
        },
      ],
      [
        "masquefa",
        {
          label: "Masquefa",
          rssFeed: "https://www.masquefa.cat/rss/12",
          postalCode: "08783",
          coords: { lat: 41.5021586, lng: 1.8113091 },
          ...sharedData,
        },
      ],
      [
        "rubio",
        {
          label: "Rubió",
          rssFeed: "https://www.rubio.cat/rss/12",
          postalCode: "08787",
          coords: { lat: 41.6444230560937, lng: 1.57003839621797 },
          ...sharedData,
        },
      ],
      [
        "prats-de-rei",
        {
          label: "Els Prats de Rei",
          rssFeed: "https://www.pratsderei.cat/rss/12",
          postalCode: "08281",
          coords: { lat: 41.7055218505712, lng: 1.54162878024642 },
          ...sharedData,
        },
      ],
      [
        "sant-marti-de-tous",
        {
          label: "Sant Martí de Tous",
          rssFeed: "https://www.tous.cat/rss/12",
          postalCode: "08712",
          coords: { lat: 41.5607908382366, lng: 1.52337834795571 },
          ...sharedData,
        },
      ],
      [
        "santamariademiralles",
        {
          label: "Santa Maria de Miralles",
          rssFeed: "https://www.santamariademiralles.cat/rss/12",
          postalCode: "08787",
          coords: { lat: 41.5197203038397, lng: 1.52765945942421 },
          ...sharedData,
        },
      ],
      [
        "vilanova-del-cami",
        {
          label: "Vilanova del Camí",
          rssFeed: "https://www.vilanovadelcami.cat/rss/12",
          postalCode: "08788",
          coords: { lat: 41.5722577646952, lng: 1.63425539497759 },
          ...sharedData,
        },
      ],
      [
        "veciana",
        {
          label: "Veciana",
          rssFeed: "https://www.veciana.cat/rss/12",
          postalCode: "08282",
          coords: { lat: 41.6559380729177, lng: 1.48857977483836 },
          ...sharedData,
        },
      ],
    ]),
  },
];
export default anoia;
