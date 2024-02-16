const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const osona = [
  "osona",
  {
    label: "Osona",
    towns: new Map([
      [
        "alpens",
        {
          label: "Alpens",
          rssFeed: "https://www.alpens.cat/rss/12",
          postalCode: "08507",
          coords: { lat: "42.1667", lng: "2.2167" },
          ...sharedData,
        },
      ],
      [
        "balenya",
        {
          label: "Balenyà",
          rssFeed: "https://www.balenya.cat/rss/12/0/",
          postalCode: "08509",
          coords: { lat: "41.95", lng: "2.3" },
          ...sharedData,
        },
      ],
      [
        "calldetenes",
        {
          label: "Calldetenes",
          rssFeed: "https://www.calldetenes.cat/rss/12/0/",
          postalCode: "08508",
          coords: { lat: "41.9333", lng: "2.3333" },
          ...sharedData,
        },
      ],
      [
        "el-brull",
        {
          label: "El Brull",
          rssFeed: "https://www.elbrull.cat/rss/12/0/",
          postalCode: "08519",
          coords: { lat: "42.1", lng: "2.2333" },
          ...sharedData,
        },
      ],
      [
        "folgueroles",
        {
          label: "Folgueroles",
          rssFeed: "https://www.folgueroles.cat/rss/12/0/",
          postalCode: "08517",
          coords: { lat: "42.0667", lng: "2.3" },
          ...sharedData,
        },
      ],
      [
        "gurb",
        {
          label: "Gurb",
          rssFeed: "https://www.gurb.cat/rss/12/0/",
          postalCode: "08503",
          coords: { lat: "41.9667", lng: "2.2833" },
          ...sharedData,
        },
      ],
      [
        "les-masies-de-roda",
        {
          label: "Les Masies de Roda",
          rssFeed: "https://www.lesmasiesderoda.cat/rss/12",
          postalCode: "08513",
          coords: { lat: "41.9333", lng: "2.2667" },
          ...sharedData,
        },
      ],
      [
        "les-masies-de-voltrega",
        {
          label: "Les Masies de Voltregà",
          rssFeed: "https://www.lesmasiesdevoltrega.cat/rss/12",
          postalCode: "08516",
          coords: { lat: "42.0167", lng: "2.2333" },
          ...sharedData,
        },
      ],
      [
        "lluca",
        {
          label: "Lluçà",
          rssFeed: "https://www.lluca.cat/rss/12",
          postalCode: "08514",
          coords: { lat: "42.0333", lng: "2.25" },
          ...sharedData,
        },
      ],
      [
        "malla",
        {
          label: "Malla",
          rssFeed: "https://www.malla-osona.cat/rss/12/0/",
          postalCode: "08511",
          coords: { lat: "41.9167", lng: "2.3333" },
          ...sharedData,
        },
      ],
      [
        "montesquiu",
        {
          label: "Montesquiu",
          rssFeed: "https://www.montesquiu.cat/rss/12/0/",
          postalCode: "08515",
          coords: { lat: "42.05", lng: "2.2167" },
          ...sharedData,
        },
      ],
      [
        "muntanyola",
        {
          label: "Muntanyola",
          rssFeed: "https://www.muntanyola.cat/rss/12/0/",
          postalCode: "08510",
          coords: { lat: "41.9667", lng: "2.2667" },
          ...sharedData,
        },
      ],
      [
        "oris",
        {
          label: "Orís",
          rssFeed: "https://www.oris.cat/rss/12/0/",
          postalCode: "08518",
          coords: { lat: "42.0833", lng: "2.2167" },
          ...sharedData,
        },
      ],
      [
        "orista",
        {
          label: "Oristà",
          rssFeed: "https://www.orista.cat/rss/12/0/",
          postalCode: "08512",
          coords: { lat: "42", lng: "2.25" },
          ...sharedData,
        },
      ],
      [
        "perafita",
        {
          label: "Perafita",
          rssFeed: "https://www.perafita.cat/rss/12",
          postalCode: "08506",
          coords: { lat: "42.1333", lng: "2.25" },
          ...sharedData,
        },
      ],
      [
        "rupit-i-pruit",
        {
          label: "Rupit i Pruit",
          rssFeed: "https://www.rupitpruit.cat/rss/12",
          postalCode: "08569",
          coords: { lat: "42.1167", lng: "2.3" },
          ...sharedData,
        },
      ],
      [
        "sant-agusti-de-llucanes",
        {
          label: "Sant Agustí de Lluçanès",
          rssFeed: "https://santagustidellucanes.cat/rss/12/0/",
          postalCode: "08514",
          coords: { lat: "42.0333", lng: "2.25" },
          ...sharedData,
        },
      ],
      [
        "sant-bartomeu-del-grau",
        {
          label: "Sant Bartomeu del Grau",
          rssFeed: "https://www.sbg.cat/rss/12/0/",
          postalCode: "08505",
          coords: { lat: "42.0667", lng: "2.2667" },
          ...sharedData,
        },
      ],
      [
        "sant-boi-de-llucanes",
        {
          label: "Sant Boi de Lluçanès",
          rssFeed: "https://www.santboidellucanes.cat/rss/12",
          postalCode: "08589",
          coords: { lat: "42.0167", lng: "2.2333" },
          ...sharedData,
        },
      ],
      [
        "sant-hipolit-de-voltrega",
        {
          label: "Sant Hipòlit de Voltregà",
          rssFeed: "https://www.santhipolitdevoltrega.cat/rss/12/0/",
          postalCode: "08516",
          coords: { lat: "42.0167", lng: "2.2333" },
          ...sharedData,
        },
      ],
      [
        "sant-julia-de-vilatorta",
        {
          label: "Sant Julià de Vilatorta",
          rssFeed: "https://www.vilatorta.cat/rss/12",
          postalCode: "08510",
          coords: { lat: "41.9667", lng: "2.2667" },
          ...sharedData,
        },
      ],
      [
        "sant-marti-dalbars",
        {
          label: "Sant Martí d’Albars",
          rssFeed: "https://www.santmartidalbars.cat/rss/12/0/",
          postalCode: "08504",
          coords: { lat: "41.95", lng: "2.2833" },
          ...sharedData,
        },
      ],
      [
        "sant-marti-de-centelles",
        {
          label: "Sant Martí de Centelles",
          rssFeed: "https://www.santmarticentelles.cat/feeds/agenda",
          postalCode: "08512",
          coords: { lat: "42", lng: "2.25" },
          ...sharedData,
        },
      ],
      [
        "sant-quirze-de-besora",
        {
          label: "Sant Quirze de Besora",
          rssFeed: "https://www.ajsantquirze.cat/rss/12/0/",
          postalCode: "08502",
          coords: { lat: "42.05", lng: "2.2833" },
          ...sharedData,
        },
      ],
      [
        "santa-cecilia-de-voltrega",
        {
          label: "Santa Cecília de Voltregà",
          rssFeed: "https://www.santacecilia.cat/rss/12/0/",
          postalCode: "08516",
          coords: { lat: "42.0167", lng: "2.2333" },
          ...sharedData,
        },
      ],
      [
        "santa-eugenia-de-berga",
        {
          label: "Santa Eugènia de Berga",
          rssFeed: "https://www.santaeugenia.cat/rss/12/0/",
          postalCode: "08690",
          coords: { lat: "42.0833", lng: "2.1667" },
          ...sharedData,
        },
      ],
      [
        "santa-eulalia-de-riuprimer",
        {
          label: "Santa Eulàlia de Riuprimer",
          rssFeed: "https://www.santaeulaliariuprimer.cat/rss/12/0/",
          postalCode: "08501",
          coords: { lat: "41.9833", lng: "2.2667" },
          ...sharedData,
        },
      ],
      [
        "santa-maria-de-besora",
        {
          label: "Santa Maria de Besora",
          rssFeed: "https://www.santamariabesora.cat/rss/12/0/",
          postalCode: "08502",
          coords: { lat: "42.05", lng: "2.2833" },
          ...sharedData,
        },
      ],
      [
        "seva",
        {
          label: "Seva",
          rssFeed: "https://www.seva.cat/rss/12",
          postalCode: "08507",
          coords: { lat: "42.1667", lng: "2.2167" },
          ...sharedData,
        },
      ],
      [
        "sobremunt",
        {
          label: "Sobremunt",
          rssFeed: "https://www.sobremunt.cat/rss/12",
          postalCode: "08506",
          coords: { lat: "42.1333", lng: "2.25" },
          ...sharedData,
        },
      ],
      [
        "sora",
        {
          label: "Sora",
          rssFeed: "https://www.sora.cat/rss/12/0/",
          postalCode: "08517",
          coords: { lat: "42.0667", lng: "2.3" },
          ...sharedData,
        },
      ],
      [
        "taradell",
        {
          label: "Taradell",
          rssFeed:
            "https://www.taradell.cat/index.php?md=articles&accio=rss&id=11990",
          postalCode: "08552",
          coords: { lat: "41.8730900", lng: "2.2842100" },
          ...sharedData,
        },
      ],
      [
        "tavertet",
        {
          label: "Tavertet",
          rssFeed: "https://www.tavertet.cat/rss/12/0/",
          postalCode: "08511",
          coords: { lat: "41.99750", lng: "2.41972" },
          ...sharedData,
        },
      ],
      [
        "tavernoles",
        {
          label: "Tavèrnoles",
          rssFeed: "https://www.tavernoles.cat/rss/12/0/",
          postalCode: "08519",
          coords: { lat: "41.9580900", lng: "2.3540300" },
          ...sharedData,
        },
      ],
      [
        "tona",
        {
          label: "Tona",
          rssFeed: "https://www.tona.cat/rss/12",
          postalCode: "08551",
          coords: { lat: "41.8479", lng: "2.2281" },
          ...sharedData,
        },
      ],
      [
        "vilanova-de-sau",
        {
          label: "Vilanova de Sau",
          rssFeed: "https://www.vilanovadesau.cat/rss/12/0/",
          postalCode: "08519",
          coords: { lat: "41.9450400", lng: "2.4233700" },
          ...sharedData,
        },
      ],
    ]),
  },
];

export default osona;
