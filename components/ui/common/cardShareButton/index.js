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
      <TelegramShareButton url={eventUrl}>
        <TelegramIcon {...iconProps} />
      </TelegramShareButton>

      <TwitterShareButton url={eventUrl}>
        <svg
          className="w-5 h-5 fill-primary"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
        </svg>
      </TwitterShareButton>

      <WhatsappShareButton url={eventUrl}>
        <WhatsappIcon {...iconProps} size={26} />
      </WhatsappShareButton>

      <FacebookShareButton url={eventUrl}>
        <FacebookIcon {...iconProps} size={32} />
      </FacebookShareButton>
    </div>
  );
}
