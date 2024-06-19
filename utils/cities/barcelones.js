import {siteUrl} from "@config/index";

const sharedData = {
    descriptionSelector: ".ddbbtext",
    imageSelector: ".first-image",
};

const barcelones = [
    "barcelones",
    {
        label: "Barcelonés",
        towns: new Map([
            [
                "cerdanyola-del-valles",
                {
                    label: "Cerdanyola del Vallès",
                    rssFeed: `${siteUrl}/api/scrapeEvents?city=cerdanyola-del-valles`,
                    postalCode: "08290",
                    coords: { lat: 41.491014, lng: 2.140862 },
                    getDescriptionFromRss: true,
                },
            ],
            [
                "badalona",
                {
                    label: "Badalona",
                    rssFeed: `${siteUrl}/api/scrapeEvents?city=badalona`,
                    postalCode: "08911",
                    coords: { lat: 41.45262481, lng: 2.24625368 },
                    getDescriptionFromRss: true,
                },
            ]
        ]),
    },
];

export default barcelones;