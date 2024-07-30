const sharedData = {
  descriptionSelector: ".ddbbtext",
  imageSelector: ".first-image",
};

const girona = [
  "girona",
  {
    label: "Girona",
    province: "girona",
    towns: new Map([
      [
        "girona",
        {
          label: "Girona",
          postalCode: "17001",
          coords: { lat: 41.98311, lng: 2.82493 },
          ...sharedData,
        },
      ],
    ]),
  },
];

export default girona;
