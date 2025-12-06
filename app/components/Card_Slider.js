import React, { useState } from "react";
import Image from "next/image";

const Card_Slider = ({ Img, Text, Price }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="card-slider">
      <div className={`card-image ${loaded ? "loaded" : "loading"}`}>
        <Image
          src={Img}
          alt={Text}
          fill
          style={{ objectFit: "contain" }}
          onLoadingComplete={() => setLoaded(true)}
          unoptimized
        />
      </div>

      <p className="card-text">{Text}</p>
      <p className="card-price">{Price}$</p>
    </div>
  );
};

export default Card_Slider;
