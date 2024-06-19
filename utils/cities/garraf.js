const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const garraf = [
  "garraf",
  {
    label: "Garraf",
    province: "barcelona",
    towns: new Map([
      [
        "ccgarraf",
        {
          label: "Vilanova i la Geltrú",
          rssFeed: "https://www.ccgarraf.cat/rss/12",
          postalCode: "08800",
          coords: { lat: 41.2240909068638, lng: 1.72593830277686 },
          ...sharedData,
        },
      ],
    ]),
  },
];
export default garraf;
