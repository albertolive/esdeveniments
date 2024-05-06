const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const vallesOccidental = [
  "valles-occidental",
  {
    label: "Vallès Occidental",
    towns: new Map([
      [
        "martorelles",
        {
          label: "Martorelles",
          rssFeed: "https://www.martorelles.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08107",
          coords: { lat: 41.5321, lng: 0.236 },
        },
      ],
      [
        "castellbisbal",
        {
          label: "Castellbisbal",
          rssFeed: "https://www.castellbisbal.cat/rss/48",
          ...sharedData,
          postalCode: "08755",
          coords: { lat: 41.4753, lng: 1.9817 },
        },
      ],
      [
        "gallifa",
        {
          label: "Gallifa",
          rssFeed: "https://www.gallifa.cat/rss/12",
          postalCode: "08146",
          coords: { lat: 41.6931569239137, lng: 2.11540352191569 },
          ...sharedData,
        },
      ],
      [
        "matadepera",
        {
          label: "Matadepera",
          rssFeed: "https://www.matadepera.cat/rss/12",
          ...sharedData,
          postalCode: "08230",
          coords: { lat: 41.60361, lng: 2.02444 },
        },
      ],
      [
        "montcada-i-reixac",
        {
          label: "Montcada i Reixac",
          rssFeed: "https://www.montcada.cat/rss/12",
          ...sharedData,
          postalCode: "08110",
          coords: { lat: 41.4833, lng: 2.1833 },
        },
      ],
      [
        "rellinars",
        {
          label: "Rellinars",
          rssFeed: "https://www.rellinars.cat/rss/12",
          ...sharedData,
          postalCode: "08299",
          coords: { lat: 41.6333, lng: 1.9167 },
        },
      ],
      [
        "sant-llorenc-savall",
        {
          label: "Sant Llorenç Savall",
          rssFeed: "https://www.savall.cat/rss/12",
          ...sharedData,
          postalCode: "08212",
          coords: { lat: 41.67944, lng: 2.05778 },
        },
      ],
      [
        "santquirze",
        {
          label: "Sant Quirze del Vallès",
          rssFeed: "https://www.ajsantquirze.cat/rss/12",
          postalCode: "08192",
          coords: { lat: 41.5330652897843, lng: 2.08074660053644 },
          ...sharedData,
        },
      ],
      [
        "santa-perpetua-de-mogoda",
        {
          label: "Santa Perpètua de Mogoda",
          rssFeed: "https://www.staperpetua.cat/rss/12/0/",
          ...sharedData,
          postalCode: "08130",
          coords: { lat: 41.5375, lng: 2.18194 },
        },
      ],
      [
        "ullastrell",
        {
          label: "Ullastrell",
          rssFeed: "https://www.ullastrell.cat/rss/12",
          ...sharedData,
          postalCode: "08231",
          coords: { lat: 41.5167, lng: 1.9333 },
        },
      ],
      [
        "polinya",
        {
          label: "Polinyà",
          rssFeed: "https://www.polinya.cat/rss/12",
          ...sharedData,
          postalCode: "08213",
          coords: { lat: 41.55, lng: 2.15 },
        },
      ],
    ]),
  },
];
export default vallesOccidental;
