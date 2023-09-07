import React from "react";

// Componente ImgDefault
function ImgDefault({ background }) {
  const styles = {
    width: "auto",
    height: "32rem",
    background: background,
  };

  return <div style={styles} className="flex flex-col justify-center items-center gap-y-8 text-whiteCorp p-10">
    <h1 className="drop-shadow text-center text-[54px] font-black tracking-wider">Trobada presencial sobre el PAM</h1>
    <h2 className="drop-shadow text-center text-[39px] font-medium tracking-wider border-t-4 pt-6">Dijous, 14/09/2023</h2>
    <p className="drop-shadow text-center text-[21px] font-normal tracking-wider">La Garriga, Vallès Oriental</p>
  </div>;
}

// Componente que utiliza ImgDefault
export default function MyComponent() {
  function getRandomBackground() {
    const gradients = [
      "linear-gradient( 135deg, #FEB692 10%, #EA5455 100%)",
      "linear-gradient( 135deg, #FFF6B7 10%, #F6416C 100%)",
      "linear-gradient( 135deg, #43CBFF 10%, #9708CC 100%)",
      "linear-gradient( 135deg, #79F1A4 10%, #0E5CAD 100%)",
      "linear-gradient( 135deg, #FFF720 10%, #3CD500 100%)",
    ];

    const randomIndex = Math.floor(Math.random() * gradients.length);

    return gradients[randomIndex];
  }

  const background = getRandomBackground();

  return (
    <div className="w-full h-full">
      <ImgDefault background={background} />
    </div>
  );
}
