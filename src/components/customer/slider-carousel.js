import React, { useState } from 'react';
import Router from 'next/router'
import { Carousel, Row, Image } from 'react-bootstrap'

import consts from '../../constants';
import CustomButton from '../CustomButton';
import DetectDeviceView from '../../hooks/detect-device-view';

const SliderCarousel = (props) => {
    const { isMobile } = DetectDeviceView();
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    const handleNavigate = sliderItem => {
        props.categories_list && props.categories_list.forEach(item => {
            if (sliderItem.category === item.label) {
                props.sub_categories_list && props.sub_categories_list.forEach(e => {
                    if (sliderItem.category === item.label && sliderItem.sub_category === e.label)
                        Router.push('/products/[category]/[sub_category]', `/products/${e.category_id}/${e._id}`)
                });
            }
        });
    }
    return (
        <div className='slider_carousel'>
            <Row noGutters className='_row'>
                <Carousel activeIndex={index} onSelect={handleSelect} indicators={false} interval={3000}>
                    {props.sliders_list && props.sliders_list.map((element, index) =>
                        <Carousel.Item key={element._id} >
                            <Image
                                style={{
                                    width: '100vw',
                                    maxWidth: '100%',
                                    minHeight: !isMobile ? '25vw' : '66vw',
                                    maxHeight: !isMobile ? '25vw' : '66vw',
                                }}
                                src={element.imageUrl}
                                alt='Slide {index}'
                            />
                            <Carousel.Caption>
                                <label className='carosuel_label'>{element.sub_category}</label>
                                <CustomButton
                                    size='lg'
                                    title={'Shop Now'}
                                    onClick={() => handleNavigate(element)}
                                />
                            </Carousel.Caption>
                        </Carousel.Item>
                    )}
                </Carousel>
            </Row>

            <style type="text/css">{`
                .slider_carousel{
                    background-image: linear-gradient(180deg, ${consts.COLORS.MAIN} 0%, ${consts.COLORS.SECONDARY} 100%);
                }
                .slider_carousel ._row{
                    border-radius: 3px;
                    background: white;
                }
                .slider_carousel .carosuel_label {
                    width: 100%;
                    font-size: 16px;
                }

                @media (max-width: 1199px){
                }
                @media (max-width: 991px){
                }
                @media (max-width: 767px) {
                    .slider_carousel .carosuel_label {
                        font-size: 13px;
                    }
                }
            `}</style>
        </div >
    )
}

const styles = {
}
export default SliderCarousel