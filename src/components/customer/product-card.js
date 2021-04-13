import React, { useState } from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import { FiShoppingCart } from 'react-icons/fi';
import ReactStars from 'react-rating-stars-component';
import consts from '../../constants';
import useDimensions from "react-use-dimensions";
import Link from 'next/link';
import CustomButton from '../CustomButton';
import axios from 'axios';
import urls from '../../utils/urls';
import AlertModal from '../alert-modal';
import constants from '../../constants';
import CalculateDiscountPrice from '../../hooks/customer/calculate-discount';

export default function ProductCard(props) {
    const { element, user, token, getUser } = props;
    const [ref, { x, y, width }] = useDimensions();
    const [isCartHover, setIsCartHover] = useState(false);
    // Alert Stuff
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMsg, setAlertMsg] = useState('');
    const [alerttype, setAlertType] = useState('');

    // Add to cart
    const [cartLoading, setCartLoading] = useState(false);
    const handleAddToCart = async () => {
        if (user.role == '') {
            setAlertType('error');
            setAlertMsg('Please Login Before Add to Cart!');
            setShowAlertModal(true);
        } else if (user.role === 'admin' || user.role === 'delivery') {
            setAlertType('error');
            setAlertMsg('Please Login as Customer!');
            setShowAlertModal(true);
        } else {
            let found = false;
            user && user.cart && user.cart.forEach(item => {
                if (element._id === item.p_id) {
                    found = true;
                    setAlertType('error');
                    setAlertMsg('Product Already exists in cart, If you want to add more go to cart and update the stock');
                    setShowAlertModal(true);
                    return
                }
            });
            if (!found) {
                setCartLoading(true);
                let data = {
                    p_id: element._id,
                    vendor_id: element.vendor_id,
                    quantity: 1
                };
                await axios.put(urls.PUT_REQUEST.ADD_TO_CART + user._id, data, {
                    headers: {
                        'authorization': token,
                    }
                }).then(function (res) {
                    setCartLoading(false);
                    setAlertType('success');
                    setAlertMsg('Product Successfully Added to Cart, You can update quantity from cart.');
                    setShowAlertModal(true);
                    setIsCartHover(false);
                    getUser();
                }).catch(function (err) {
                    setIsCartHover(false);
                    setCartLoading(false);
                    setAlertType('error');
                    setAlertMsg('Product Not Added to Cart, Please Try Again Later');
                    setShowAlertModal(true);
                    console.log('Add to cart error:', err);
                });
            }
        }
    }
    // ENd of Add to cart
    return (
        <div className='_productCard'>
            <AlertModal
                onHide={() => setShowAlertModal(false)}
                show={showAlertModal}
                alerttype={alerttype}
                message={alertMsg}
            />
            <Link href='/products/[category]/[sub_category]/[product]' as={`/products/${element.categoryId}/${element.subCategoryId}/${element._id}`}>
                <Card className='_card' >
                    <Card.Body className='p-3'>
                        {element.discount && element.discount > 0 &&
                            <div style={{
                                position: 'absolute', right: '0px', top: '0px', background: constants.COLORS.MAIN, opacity: 0.8,
                                width: '60px', height: '60px', borderBottomLeftRadius: '90%', justifyContent: 'center', alignItems: 'center', display: 'flex'
                            }}>
                                <label style={{ color: constants.COLORS.WHITE, fontSize: '15px' }}>-{element.discount}% </label>
                            </div>
                        }
                        <Card.Title style={{
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            color: consts.COLORS.TEXT
                        }}
                        >{element.name}</Card.Title>
                        <Card.Text className='descriptions' >
                            {element.description}
                        </Card.Text>
                        <Card.Img
                            variant="top"
                            ref={ref}
                            src={element.imagesUrl && element.imagesUrl[0] && element.imagesUrl[0].imageUrl}
                            style={{ minWidth: '100%', minHeight: width + (width / (consts.SIZES.IMAGE_HEIGHT_DIVIDE + 1)), maxHeight: width + (width / (consts.SIZES.IMAGE_HEIGHT_DIVIDE + 1)) }}
                        />
                        <div style={{ borderTop: `1px solid lightgray`, margin: '5px 0px' }} />
                        <Row noGutters>
                            <Col className='p-0'>
                                <ReactStars
                                    count={5}
                                    value={element && element.rating_review && element.rating_review.rating && element.rating_review.rating.overall || 0}
                                    edit={false}
                                    size={15}
                                    activeColor='orange'
                                />
                                {element.discount && element.discount > 0 ?
                                    <h6 className='p-0 m-0' style={{ color: consts.COLORS.MAIN, fontWeight: 'bold' }}>
                                        {'Rs: '}
                                        <CalculateDiscountPrice price={element.price} discount={element.discount} />
                                        <span style={{ textDecorationLine: 'line-through', color: consts.COLORS.TEXT, fontSize: '12px', marginLeft: '5px' }}>{element.price}</span>
                                    </h6>
                                    :
                                    <h6 className='p-0 m-0' style={{ color: consts.COLORS.MAIN, fontWeight: 'bold' }}>{'Rs: ' + element.price}</h6>
                                }
                            </Col>
                            <Col></Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Link>
            <div
                onMouseEnter={() => setIsCartHover(true)}
                onMouseLeave={() => { setIsCartHover(cartLoading ? true : false) }}
                style={{ position: 'absolute', zIndex: 100, bottom: '20px', right: '20px' }}
            >
                <div className='mr-auto' />
                {isCartHover ?
                    // <div style={{ position: 'absolute', top: '0px', right: '0px', bottom: '0px' }}>
                    <CustomButton
                        size={'sm'}
                        loading={cartLoading}
                        disabled={cartLoading}
                        title={'ADD TO CART'}
                        spinnerSize={'lg'}
                        onlyLoading
                        // TODO
                        // onClick={() => handleAddToCart()}
                        onClick={() => {}}
                    />
                    // </div>
                    :
                    <div style={{ border: `1px solid ${consts.COLORS.TEXT}`, borderRadius: '3px', padding: '5px' }}>
                        <FiShoppingCart style={{ fontSize: '20px', color: consts.COLORS.DANGER }} />
                    </div>}
            </div>
            <style type="text/css">{`
                ._productCard {
                    z-index: 1;
                }
                ._productCard ._card {
                    margin: 3%;
                    z-index: 1;
                }
                .descriptions {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2; /* number of lines to show */
                    -webkit-box-orient: vertical;
                    font-size: 12px;
                    color: ${consts.COLORS.TEXT}
                }
                ._productCard ._card:hover{
                    box-shadow: 0px 0px 10px 0.5px ${consts.COLORS.SHADOW};
                    transition: width 0.5s, height 0.5s, opacity 0.5s 0.5s;
                    cursor: pointer;
                    // border: none;
                    // margin: 2%;
                }
            `}</style>
        </div>
    )
}
