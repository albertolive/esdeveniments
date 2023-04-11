import { useState, memo } from "react";
import Image from "next/image";
import useCheckMobileScreen from "@components/hooks/useCheckMobileScreen";

const AD_SIZES = {
  mobile: ["250x250", "300x250", "300x300", "500x500", "468x60", "320x50"],
  desktop: ["728x90", "768x90", "468x60"],
  card: ["250x250", "300x250", "300x300", "500x500", "468x60", "320x50"],
};

const ADS = [
  {
    229716: {
      "728x90": [24343316, 20915480],
      "468x60": [24817014],
      "300x250": [20915458, 20915450],
    },
  },
  {
    275411: { "728x90": [23572120], "300x250": [23798116] },
  },
  {
    301197: {
      "970x90": [25300182],
      "728x200": [25300184],
      "728x90": [25300186],
      "468x60": [25300188],
      "300x250": [25300190, 25300190],
      "250x250": [25300192],
    },
  },
  {
    309704: {
      "728x90": [25362064, 24869928, 24976436],
      "468x60": [24976434],
      "300x250": [24869920, 24976432, 24869918],
      "250x250": [25362054],
    },
  },
  {
    311896: {
      "728x90": [25277228, 25277206, 25277170, 24939044],
      "300x250": [
        25387860, 25387858, 25387856, 25387854, 25387852, 25387850, 25387848,
        25387524, 25387516, 25387716, 25387714, 25387712, 25387696, 25387694,
        25387678, 25387676, 25387674, 25387670, 25387668, 25387652,
      ],
      "250x250": [
        25383264, 25383266, 24954442, 24946138, 24939040, 24939036, 24931942,
        24931940, 24929066, 24928994, 24928990, 24923044, 24923036, 24923032,
        24923028, 24921318, 24921274, 24921272, 24921252, 2492123,
      ],
    },
  },
  {
    313582: {
      "750x200": [25018402],
      "728x90": [25241302, 25249106, 24941260],
      "300x250": [25241296, 24941250, 25098394, 25249104],
      "250x250": [25241294, 24941178],
    },
  },
  {
    315333: {
      "728x90": [25074872, 25018404, 24961300],
      "750x200": [25018402, 24962674],
      "300x250": [25074876, 25018342, 24961298],
    },
  },
  {
    317095: {
      "728x90": [25185444, 25043178],
      "300x250": [25185438, 24986942, 24985612, 24984772],
      "250x250": [25185436, 24986934, 24985614, 24984766],
    },
  },
  {
    332250: {
      "500x500": [25349542],
      "300x250": [25349546],
      "250x250": [25349544],
    },
  },
  {
    333415: {
      "728x90": [25385356, 25385338, 25349026],
      "300x250": [25385344, 25385362, 25349032],
    },
  },
  {
    334424: { "728x90": [25393428, 25340716], "300x250": [25340706, 25340704] },
  },
  {
    334463: {
      "728x90": [25376808, 25376806, 25376804, 25376802],
      "500x500": [
        25364874, 25364872, 25364870, 25364868, 25364866, 25364864, 25364862,
        25364860, 25364858, 25364856,
      ],
    },
  },
  { 334657: { "728x90": [25386922], "500x500": [25386920, 25357058] } },
  {
    336366: {
      "728x90": [25389798],
      "500x500": [25383084, 25383082, 25383080, 25383078],
      "300x250": [25389802, 25389760, 25389800],
      "250x250": [25389762],
    },
  },
  {
    304859: {
      "728x90": [25392858, 25392804, 24788454, 24848244],
      "500x500": [25392866, 25392780, 25292050],
      "300x250": [25392848, 24848250],
    },
  },
  {
    327062: {
      "768x90": [25189208],
      "728x90": [25189206],
      "468x60": [25189204],
      "300x250": [25189196],
      "300x300": [25189198],
      "320x50": [25189202],
    },
  },
  {
    303598: {
      "728x90": [24733124, 24718212],
      "468x60": [24733120, 24718210],
      "300x250": [24733108, 24718206],
      "250x250": [24733092],
      "320x50": [25189202],
    },
  },
];

const getSize = (adIds, isCard, isBanner, isMobile) => {
  if (isCard) return AD_SIZES["card"].find((size) => adIds[size]);

  if (isBanner) {
    return isMobile
      ? AD_SIZES["mobile"].find((size) => adIds[size])
      : AD_SIZES["desktop"].find((size) => adIds[size]);
  }
};

export default memo(function TradedoublerIframe({
  isCard = false,
  isBanner = false,
}) {
  const [hideImage, setHideImage] = useState(false);

  const isMobile = useCheckMobileScreen();
  const program = ADS[Math.floor(Math.random() * ADS.length)];
  const programId = Number(Object.keys(program));

  const programs = program[programId];
  const size = getSize(programs, isCard, isBanner, isMobile);
  const adIds = programs[size];

  if (!adIds) return null;

  if (Array.isArray(adIds) && !adIds.length) return null;

  const [width, height] = size.split("x");
  const adId = adIds[Math.floor(Math.random() * adIds.length)];
  const uri = `https://impfr.tradedoubler.com/imp?type(img)g(${adId})a(3299008)`;

  if (hideImage) return null;

  return (
    <div className={`text-center min-w-[${width}px] min-h-[${height}px]`}>
      <a
        href={`https://clk.tradedoubler.com/click?p=${programId}&a=3299008&g=${adId}`}
        target="_BLANK"
        rel="noreferrer"
      >
        <Image
          priority
          src={uri}
          srcSet={`${uri} 1200w, 
             ${uri}?w=200 200w,
             ${uri}?w=400 400w, 
             ${uri}?w=800 800w, 
             ${uri}?w=1024 1024w`}
          border="0"
          width={width}
          height={height}
          alt="tradedoubler"
          onError={() => {
            setHideImage(true);
          }}
          placeholder="blur"
          blurDataURL="/static/images/blur.png"
        />
      </a>
    </div>
  );
});
