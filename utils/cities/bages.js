const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const bages = [
  "bages",
  {
    label: "Bages",
    province: "barcelona",
    towns: new Map([
      [
        "aguilardesegarra",
        {
          label: "Aguilar de Segarra",
          rssFeed: "https://www.aguilardesegarra.cat/rss/12",
          postalCode: "08256",
          coords: { lat: 41.7393269276599, lng: 1.62800211332698 },
        },
      ],
      [
        "artes",
        {
          label: "Artés",
          rssFeed: "https://www.artes.cat/rss/12",
          postalCode: "08271",
          coords: { lat: 41.7980913342693, lng: 1.95507456718932 },
          ...sharedData,
        },
      ],
      [
        "castellnoudebages",
        {
          label: "Castellnou de Bages",
          rssFeed: "https://www.castellnoudebages.cat/rss/12",
          postalCode: "08251",
          coords: { lat: 41.8341587689496, lng: 1.83715718011212 },
          ...sharedData,
        },
      ],
      [
        "castellgali",
        {
          label: "Castellgalí",
          rssFeed: "https://www.castellgali.cat/rss/12",
          postalCode: "08297",
          coords: { lat: 41.6763623469284, lng: 1.84279758184021 },
          ...sharedData,
        },
      ],
      [
        "gaia",
        {
          label: "Gaia",
          rssFeed: "https://www.gaia.cat/rss/12",
          postalCode: "08672",
          coords: { lat: 41.9163205142968, lng: 1.92491197061593 },
          ...sharedData,
        },
      ],
      [
        "monistroldemontserrat",
        {
          label: "Monistrol de Montserrat",
          rssFeed: "https://www.monistroldemontserrat.cat/rss/12",
          postalCode: "08691",
          coords: { lat: 41.6098211941944, lng: 1.84273898525919 },
          ...sharedData,
        },
      ],
      [
        "mura",
        {
          label: "Mura",
          rssFeed: "https://www.mura.cat/rss/12",
          postalCode: "08278",
          coords: { lat: 41.7002149, lng: 1.976114 },
          ...sharedData,
        },
      ],
      [
        "navarcles",
        {
          label: "Navarcles",
          rssFeed: "https://www.navarcles.cat/rss/12",
          postalCode: "08270",
          coords: { lat: 41.7514953799934, lng: 1.90395239134655 },
        },
      ],
      [
        "rajadell",
        {
          label: "Rajadell",
          rssFeed: "https://www.rajadell.cat/rss/12",
          postalCode: "08256",
          coords: { lat: 41.7276384348811, lng: 1.70604077967352 },
          ...sharedData,
        },
      ],
      [
        "santpedor",
        {
          label: "Santpedor",
          rssFeed: "https://www.santpedor.cat/rss/12",
          postalCode: "08251",
          coords: { lat: 41.7832491007884, lng: 1.83909496018615 },
        },
      ],
      [
        "santsalvadordeguardiola",
        {
          label: "Sant Salvador de Guardiola",
          rssFeed: "https://www.santsalvadordeguardiola.cat/rss/12",
          postalCode: "08253",
          coords: { lat: 41.6785918251524, lng: 1.76656144678538 },
          ...sharedData,
        },
      ],
      [
        "elpont",
        {
          label: "El Pont de Vilomara i Rocafort",
          rssFeed: "https://www.elpont.cat/rss/12",
          postalCode: "08254",
          coords: { lat: 41.6655918, lng: 1.8638682 },
          ...sharedData,
        },
      ],
    ]),
  },
];
export default bages;
