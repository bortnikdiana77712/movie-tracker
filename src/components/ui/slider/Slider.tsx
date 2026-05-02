import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import { Loading, MovieCard } from "../..";
import type { Film } from "../../../types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// @ts-expect-error - CSS
import "swiper/css";
import styles from "./Slider.module.css";

interface SliderProps {
  title: string;
  films: Film[];
  loading?: boolean;
}

export const Slider = ({ title, films, loading }: SliderProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    if (swiperRef.current && films.length > 0) {
      const slidesPerView = swiperRef.current.params.slidesPerView;
      const totalSlides = films.length;

      if (typeof slidesPerView === "number") {
        setShowArrows(totalSlides > slidesPerView);
      } else {
        setShowArrows(totalSlides > 3);
      }
    }
  }, [films]);

  if (loading) return <Loading />;

  if (!films || films.length === 0) {
    return null;
  }

  const handlePrev = () => {
    if (swiperRef.current) swiperRef.current.slidePrev();
  };

  const handleNext = () => {
    if (swiperRef.current) swiperRef.current.slideNext();
  };

  return (
    <div className={styles.slider}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.sliderWrapper}>
        {showArrows && (
          <button
            onClick={handlePrev}
            disabled={isBeginning}
            className={styles.prevBtn}
          >
            <FaChevronLeft />
          </button>
        )}

        <Swiper
          modules={[]}
          spaceBetween={16}
          slidesPerView={5}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);

            const slidesPerView = swiper.params.slidesPerView;
            if (typeof slidesPerView === "number") {
              setShowArrows(films.length > slidesPerView);
            }
          }}
          onSlideChange={(swiper) => {
            setIsBeginning(swiper.isBeginning);
            setIsEnd(swiper.isEnd);
          }}
          breakpoints={{
            420: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
          }}
        >
          {films.map((film) => (
            <SwiperSlide key={film.id}>
              <MovieCard film={film} />
            </SwiperSlide>
          ))}
        </Swiper>

        {showArrows && (
          <button
            onClick={handleNext}
            disabled={isEnd}
            className={styles.nextBtn}
          >
            <FaChevronRight />
          </button>
        )}
      </div>
    </div>
  );
};
