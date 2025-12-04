import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation,Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Slider = ({ slides }) => {
  return (
    <div className="relative group">
      <Swiper
        modules={[Navigation,Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        autoplay={{ delay: 1500, disableOnInteraction: false }}
        loop={true}
        className="mySwiper rounded-lg"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full object-cover rounded-lg"
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
