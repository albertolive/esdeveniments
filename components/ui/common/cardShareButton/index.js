import { siteUrl } from "@config/index";
import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
} from "react-share";

export default function CardShareButton({ slug }) {
  const eventUrl = `${siteUrl}/e/${slug}`;

  const iconProps = {
    bgStyle: { fill: "#FFF" },
    iconFillColor: "#FF0037",
    size: 28,
    round: true,
  };

  return (
    <div className="w-full h-8 flex justify-start items-center gap-6 px-2">
      <FacebookShareButton url={eventUrl}>
        <FacebookIcon {...iconProps} size={32} />
      </FacebookShareButton>

      <TwitterShareButton url={eventUrl}>
        <TwitterIcon {...iconProps} size={32} />
      </TwitterShareButton>

      <TelegramShareButton url={eventUrl}>
        <TelegramIcon {...iconProps} />
      </TelegramShareButton>

      <WhatsappShareButton url={eventUrl}>
        <WhatsappIcon {...iconProps} size={26} />
      </WhatsappShareButton>
    </div>
  );
}
