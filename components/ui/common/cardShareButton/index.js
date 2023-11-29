import React, { useState, useEffect } from 'react';
import { useGetEvent } from "@components/hooks/useGetEvent";
import { FacebookShareButton, TwitterShareButton, TelegramShareButton, WhatsappShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, TelegramIcon, WhatsappIcon } from 'react-share';
import { siteUrl } from "@config/index";

export default function CardShareButton({ event }) {
  const [iconProps, setIconProps] = useState({
    bgStyle: { fill: '#FFF' },
    iconFillColor: '#FF0037',
    size: 28,
    round: true
  });

  // const { data } = useGetEvent({ event });
  const [eventUrl, setEventUrl] = useState('');

  // useEffect(() => {
  //   if (data && data.event) {
  //     setEventUrl(`${siteUrl}/event/${data.event.slug}`);
  //   }
  // }, [data]);
  
  return (
    <div className='w-full h-8 flex justify-start items-center gap-6 px-2'>
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
};
