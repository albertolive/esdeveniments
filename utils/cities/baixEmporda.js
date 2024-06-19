const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const baixEmporda = [
  "baix-emporda",
  {
    label: "Baix Empordà",
    province: "Girona",
    towns: new Map([
      [
        "palafrugell",
        {
          label: "Palafrugell",
          rssFeed: "https://www.palafrugell.cat/rss/12",
          postalCode: "17200",
          coords: { lat: 41.9149953381861, lng: 3.1642753089217 },
          ...sharedData,
        },
      ],
      [
        "palamos",
        {
          label: "Palamós",
          rssFeed: "https://www.palamos.cat/rss/12",
          postalCode: "17230",
          coords: { lat: 41.8463837113647, lng: 3.12935212656471 },
          ...sharedData,
        },
      ],
    ]),
  },
];
export default baixEmporda;
