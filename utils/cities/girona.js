const girona = {
  defaultLocation: "Girona",
  domain: "https://www.girona.cat",
  url: "https://www.girona.cat/cultura/cat/agenda.php",
  encoding: "utf-8",
  listSelector: "item",
  titleSelector: "title",
  urlSelector: "link",
  dateSelector: "pubDate",
  dateAttr: "",
  timeSelector: "",
  descriptionSelector: "description",
  imageSelector: "",
  locationSelector: "",
  urlImage: "",
  dateRegex: {
    regex: /(\d{1,2})\/(\d{1,2})\/(\d{4})/i,
    swapDayMonthOrder: false,
  },
  timeRegex: /(\d{1,2}):(\d{2})/i,
  isRSS: true,
  alternativeScrapper: false,
};

module.exports = girona;
