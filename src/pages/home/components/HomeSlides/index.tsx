import React from 'react';
import { Swiper } from 'antd-mobile';
import { ISlide } from '../../models/home';
import styles from './index.less';

interface HomeSlidesProps {
  slides?: ISlide[];
}

const HomeSlides: React.FC<HomeSlidesProps> = ({ slides = [] }) => {
  if (!slides.length) {
    return null;
  }
  return (
    <div className={styles.container}>
      <Swiper>
        {slides.map(item => (
          <Swiper.Item key={item.id}>
            <img src={item.image} alt="" />
          </Swiper.Item>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeSlides;
