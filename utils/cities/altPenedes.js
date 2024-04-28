const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const altPenedes = [
  "alt-penedes",
  {
    label: "Alt Penedès",
    towns: new Map([
      [
        "castellvidelamarca",
        {
          label: "Castellví de la Marca",
          rssFeed: "https://www.castellvidelamarca.cat/rss/12",
          postalCode: "08732",
          coords: { lat: "41.3264014117212", lng: "1.6182192763176" },
          ...sharedData,
        },
      ],
      [
        "lescabanyes",
        {
          label: "Les Cabanyes",
          rssFeed: "https://www.lescabanyes.cat/rss/12",
          postalCode: "08794",
          coords: { lat: "41.3714274816254", lng: "1.6892218402649" },
          ...sharedData,
        },
      ],
      [
        "olesadebonesvalls",
        {
          label: "Olesa de Bonesvalls",
          rssFeed: "https://www.olesadebonesvalls.cat/rss/12",
          postalCode: "08795",
          coords: { lat: "41.3518522882521", lng: "1.85051081365612" },
          ...sharedData,
        },
      ],
      [
        "puigdalber",
        {
          label: "Puigdàlber",
          rssFeed: "https://www.puigdalber.cat/rss/12",
          postalCode: "08797",
          coords: { lat: "41.403980283735", lng: "1.70066184025266" },
          ...sharedData,
        },
      ],
      [
        "santcugatsesgarrigues",
        {
          label: "Sant Cugat Sesgarrigues",
          rssFeed: "https://www.santcugatsesgarrigues.cat/rss/12",
          postalCode: "08798",
          coords: { lat: "41.3626636363117", lng: "1.7523422464589" },
          ...sharedData,
        },
      ],
      [
        "santperederiudebitlles",
        {
          label: "Sant Pere de Riudebitlles",
          rssFeed: "https://www.santperederiudebitlles.cat/rss/12",
          postalCode: "08776",
          coords: { lat: "41.4535458441134", lng: "1.70179634309756" },
          ...sharedData,
        },
      ],
      [
        "santquintimediona",
        {
          label: "Sant Quintí de Mediona",
          rssFeed: "https://www.santquintimediona.cat/rss/12",
          postalCode: "08777",
          coords: { lat: "41.4620598971063", lng: "1.66288677983927" },
          ...sharedData,
        },
      ],
      [
        "santafepenedes",
        {
          label: "Santa Fe del Penedès",
          rssFeed: "https://www.santafepenedes.cat/rss/12",
          postalCode: "08792",
          coords: { lat: "41.3845654612294", lng: "1.72096244904519" },
          ...sharedData,
        },
      ],
      [
        "torrelavit",
        {
          label: "Torrelavit",
          rssFeed: "https://www.torrelavit.cat/rss/12",
          postalCode: "08793",
          coords: { lat: "41.3609618451061", lng: "1.77933313221122" },
          ...sharedData,
        },
      ],
    ]),
  },
];
export default altPenedes;
