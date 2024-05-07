const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const altEmporda = [
  "alt-emporda",
  {
    label: "Alt Empordà",
    towns: new Map([
      [
        "figueres",
        {
          label: "Figueres",
          rssFeed: "https://www.figueres.cat/rss/12",
          postalCode: "17600",
          coords: { lat: 42.2673255741329, lng: 2.96063275701546 },
          ...sharedData,
        },
      ],
      [
        "vilamalla",
        {
          label: "Vilamalla",
          rssFeed: "https://vilamalla.cat/rss/12",
          postalCode: "17469",
          coords: { lat: 42.217140456676, lng: 2.97102410578472 },
          ...sharedData,
        },
      ],
      [
        "l'escala",
        {
          label: "L'Escala",
          rssFeed: "https://www.lescala.cat/rss/12",
          postalCode: "17130",
          coords: { lat: 42.124898, lng: 3.1323601 },
          ...sharedData,
        },
      ],
    ]),
  },
];
export default altEmporda;
