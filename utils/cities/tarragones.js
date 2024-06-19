import {siteUrl} from "@config/index";

const sharedData = {
    descriptionSelector: ".ddbbtext",
    imageSelector: ".first-image",
};

const tarragones = [
    "tarragones",
    {
        label: "Tarragonés",
        towns: new Map([
            [
                "bot",
                {
                    label: "Bot",
                    rssFeed: `${siteUrl}/api/scrapeEvents?city=bot`,
                    postalCode: "43785",
                    coords: { lat: 41.009169, lng: 0.384250 },
                    getDescriptionFromRss: true,
                },
            ],
            [
                "la-nou-de-gaia",
                {
                    label: "La Nou de Gaià",
                    rssFeed: `${siteUrl}/api/scrapeEvents?city=la-nou-de-gaia`,
                    postalCode: "43763",
                    coords: { lat: 41.182941, lng: 1.373928 },
                    getDescriptionFromRss: true,
                },
            ],
            [
                "altafulla",
                {
                    label: "Altafulla",
                    rssFeed: `${siteUrl}/api/scrapeEvents?city=altafulla`,
                    postalCode: "43893",
                    coords: { lat: 41.142162, lng: 1.376840 },
                    getDescriptionFromRss: true,
                }
            ],
            [
                "tarragona",
                {
                    label: "Tarragona",
                    rssFeed: `${siteUrl}/api/scrapeEvents?city=tarragona`,
                    postalCode: "43005",
                    coords: { lat: 41.119221, lng: 1.245897 },
                    getDescriptionFromRss: true,
                }
            ]
        ]),
    },
];

export default tarragones;