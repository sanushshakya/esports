"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { getBanners } from "../services/banner";

interface Banner {
  image: string;
}

const BannerSlider = () => {
  const [banners, setBanners] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBanners = async () => {
      const data = await getBanners();
      setBanners(data);
    };

    fetchBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="relative w-full overflow-hidden">
      {banners.length > 0 ? (
        <Slider {...settings} className="w-full">
          {banners.map((banner, index) => (
            <div key={index} className="w-full">
              <img
                src={`http://localhost:8000${banner.image}`}
                alt={`Banner ${index + 1}`}
                className="w-full h-auto lg:h-[500px] object-cover"
              />
            </div>
          ))}
        </Slider>
      ) : (
        <p>No banners available.</p>
      )}
    </div>
  );
};

export default BannerSlider;
