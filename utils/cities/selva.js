const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const selva = [
  "selva",
  {
    label: "Selva",
    towns: new Map([
      [
        "fogars-de-la-selva",
        {
          label: "Fogars de la Selva",
          rssFeed: "https://www.fogarsdelaselva.cat/rss/12",
          postalCode: "08495",
          coords: { lat: "41.7339", lng: "2.6741" },
          ...sharedData,
        },
      ],
    ]),
  },
];

export default selva;
