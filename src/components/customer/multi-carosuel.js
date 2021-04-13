import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import Carousel from "react-multi-carousel";
import Link from 'next/link';

import getProductsByCategorySubCategoryPageLimit from '../../hooks/customer/getProductsByCategorySubCategoryPageLimit';
import ProductCard from './product-card';
import constants from '../../constants';
import NoDataFound from '../no-data-found';
import Loading from '../loading';

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToSlide: 3 // optional, default to 1.
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
    }
};

export default function MultiCarosuel(props) {
    const { user, token, getUser, categories_list, sub_categories_list } = props;

    return (
        categories_list && categories_list.map((element, index) => (
            <MultiCarosuelRow
                key={index}
                user={user}
                getUser={getUser}
                token={token}
                category={element}
                sub_categories_list={sub_categories_list}
            />
        ))
    )
}

function MultiCarosuelRow(props) {
    const { user, token, getUser, category, sub_categories_list } = props;
    const [page, setPage] = useState(1);
    const [subCategory_id, setSubCategory_id] = useState(null);

    const { PRODUCTS_PAGE_LIMIT_LOADING, PRODUCTS_PAGE_LIMIT_ERROR, PRODUCTS_PAGE_LIMIT_PRODUCTS, PRODUCTS_PAGE_LIMIT_HAS_MORE } =
        getProductsByCategorySubCategoryPageLimit(category._id, subCategory_id, page, '9');

    return (
        <div>
            { PRODUCTS_PAGE_LIMIT_PRODUCTS && PRODUCTS_PAGE_LIMIT_PRODUCTS.length > 0 &&
                <div className='_multiCarosuel'>
                    <Row noGutters>
                        <Col lg={12} md={12} sm={12} xs={12}>
                            <Card style={{ flex: 1, border: 'none', }}>
                                <Card.Body className='pb-0 mb-0'>
                                    <Row noGutters>
                                        <Col lg={5} md={5} sm={8} xs={8} className='d-flex align-items-center'>
                                            <h3 style={{ color: constants.COLORS.TEXT }}>{props.category.value}</h3>
                                        </Col>
                                        <Col lg={5} md={5} className='align-items-center sm_xs_display_none'>
                                            <div style={{ borderBottom: `0.25px solid ${constants.COLORS.SHADOW}`, width: '100%', maxHeight: '0.5px' }} />
                                        </Col>
                                        <Col lg={2} md={2} sm={4} xs={4} className='ml-auto d-flex align-items-center'>
                                            <Link href='/products/[category]' as={`/products/${category._id}`}  >
                                                <a style={{ marginLeft: 'auto', color: constants.COLORS.LINK, fontSize: '15px', cursor: 'pointer' }}>{'Show More'}</a>
                                            </Link>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <Row noGutters>
                        <Col lg={3} md={3} className='sm_xs_display_none overflow-auto'>
                            <Card style={{ flex: 1, border: 'none', }}>
                                <Card.Body>
                                    {sub_categories_list && sub_categories_list.map((element, index) => {
                                        if (category._id === element.category_id) {
                                            return <div key={index} onClick={() => setSubCategory_id(element._id)} className='_a'>{element.label}</div>
                                        }
                                    })}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={9} md={9} sm={12} xs={12} >
                            {PRODUCTS_PAGE_LIMIT_LOADING ?
                                <Loading />
                                :
                                PRODUCTS_PAGE_LIMIT_PRODUCTS && PRODUCTS_PAGE_LIMIT_PRODUCTS.length > 0 ?
                                    <Carousel
                                        swipeable={true}
                                        draggable={true}
                                        showDots={false}
                                        slidesToSlide={1}
                                        responsive={responsive}
                                        ssr={true} // means to render carousel on server-side.
                                        infinite={true}
                                        // autoPlay={true}
                                        // autoPlaySpeed={1000}
                                        keyBoardControl={true}
                                        // customTransition="transform 300ms ease-in-out"
                                        customTransition="all .5s linear"
                                        // transitionDuration={3000}
                                        containerClass="carousel-container"
                                        removeArrowOnDeviceType={["tablet", "mobile"]}
                                        // deviceType={this.props.deviceType}
                                        // dotListClass="custom-dot-list-style"
                                        // customLeftArrow={}
                                        itemClass="carousel-item-padding-50-px"
                                    >
                                        {PRODUCTS_PAGE_LIMIT_PRODUCTS && PRODUCTS_PAGE_LIMIT_PRODUCTS.map((element, index) => (
                                            <ProductCard
                                                user={user}
                                                getUser={getUser}
                                                token={token}
                                                element={element}
                                                key={index}
                                            />
                                        ))}
                                    </Carousel>
                                    :
                                    <NoDataFound />
                            }
                        </Col>
                    </Row>
                </div>
            }
            <style type="text/css">{`
                ._multiCarosuel ._a {
                    width: 100%;
                    padding: 2% 5%;
                    border-radius: 5px;
                    color: ${constants.COLORS.TEXT};
                    cursor: pointer;
                }
                ._multiCarosuel ._a:hover{
                    text-decoration: none;
                    background: ${constants.COLORS.MAIN};
                    color: ${constants.COLORS.WHITE};
                }
                ._multiCarosuel h3 {
                    font-weight: bold;
                }
                ._multiCarosuel label {
                    font-weight: bold;
                    color: ${constants.COLORS.MAIN};
                    font-size: 18px;
                    font-family: Rubik, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif;
                }
                
                ._multiCarosuel .sm_xs_display_none {
                    display: flex;
                }
                @media only screen and (max-width: 600px) {
                    ._multiCarosuel {
                        padding: 2% 5%;
                    }
                    ._multiCarosuel .sm_xs_display_none {
                        display: none;
                    }
                }
                @media only screen and (min-width: 600px) {
                    ._multiCarosuel {
                        padding: 2% 5%;
                    }
                }
                @media only screen and (min-width: 768px) {
                    ._multiCarosuel {
                        padding: 2% 7%;
                    }
                }
                @media only screen and (min-width: 992px) {
                    ._multiCarosuel {
                        padding: 2% 9%;
                    }
                }
                @media only screen and (min-width: 1200px) {
                    ._multiCarosuel {
                        padding: 2% 12%;
                    }
                }
            `}</style>
            <style jsx global>{`
                * {
                    font-family: Oswald,sans-serif;
                }
            `}</style>
        </div>
    )
}
