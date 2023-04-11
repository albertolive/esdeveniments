const getRandomBanner = (randomNumber) => {
  switch (randomNumber) {
    case 0:
      return {
        category: "prime_video",
        bannerMd: "1WM3P83JBRAEDHZ74YR2",
        bannerSm: "093TP09QSWSGKXVP9S82",
      };
    case 1:
      return {
        category: "kindle_unlimited",
        bannerMd: "1J0SP8MJCYHK1HCQC302",
        bannerSm: "0A8ZM7ZCCKPJH18EHF02",
      };
    case 2:
      return {
        category: "esgifting",
        bannerMd: "1HF9J5VBHJTZJ19VM7G2",
        bannerSm: "10EA58XZGXH783N49T02",
      };
    case 2:
      return {
        category: "esgifting",
        bannerMd: "1HF9J5VBHJTZJ19VM7G2",
        bannerSm: "10EA58XZGXH783N49T02",
      };
    case 3:
      return {
        category: "baby",
        bannerMd: "0104Y6ED7HTD8SXP9N82",
        bannerSm: "0RK5J9RXBVJQ8VHR6WR2",
      };
    case 4:
      return {
        category: "pw",
        bannerMd: "0GMBF4ER60VQS6MC96G2",
        bannerSm: "0K277589R8013X2Z24R2",
      };
    case 5:
      return {
        category: "amazongeneric",
        bannerMd: "0FNP5YECWKWRM9GK6M82",
        bannerSm: "0ZCQ8KEYSKRKYKPN9C82",
      };
  }
};

export default function AmazonIframe() {
  const randomNumber = Math.floor(Math.random() * 6);
  const { category, bannerMd, bannerSm } = getRandomBanner(randomNumber);

  return (
    <>
      <div className="hidden md:block">
        <iframe
          src={`https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=48&l=ur1&category=${category}&banner=${bannerMd}&f=ifr&linkID={{link_id}}&t=albertolive-21&tracking_id=albertolive-21`}
          width="728"
          height="90"
          border="0"
          style={{ border: "none" }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
        ></iframe>
      </div>
      <div className="block md:hidden">
        <iframe
          src={`https://rcm-eu.amazon-adsystem.com/e/cm?o=30&p=12&l=ur1&category=${category}&banner=${bannerSm}&f=ifr&linkID={{link_id}}&t=albertolive-21&tracking_id=albertolive-21`}
          width="300"
          height="250"
          border="0"
          style={{ border: "none" }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-top-navigation-by-user-activation"
        ></iframe>
      </div>
    </>
  );
}
