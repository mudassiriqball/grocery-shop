import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Col, Form, Image, InputGroup, Nav, Row, Tab, Table, Tabs } from 'react-bootstrap';
import ReactStars from 'react-rating-stars-component';
import useDimensions from "react-use-dimensions";
import DetectDeviceView from "../../../../hooks/detect-device-view";
import { useRouter } from 'next/router';
import axios from 'axios';

import getProductsByCategorySubCategoryPageLimit from '../../../../hooks/customer/getProductsByCategorySubCategoryPageLimit';
import { getDecodedTokenFromStorage, getTokenFromStorage } from '../../../../utils/services/auth';
import ProductCard from '../../../../components/customer/product-card';
import NoDataFound from '../../../../components/no-data-found';
import CustomButton from '../../../../components/CustomButton';
import Layout from '../../../../components/customer/Layout';
import Footer from '../../../../components/customer/footer';
import Loading from '../../../../components/loading';
import consts from '../../../../constants';
import urls from '../../../../utils/urls';

import StickyBottomNavbar from '../../../../components/customer/sticky-bottom-navbar';
import AlertModal from '../../../../components/alert-modal';
import constants from '../../../../constants';

export async function getServerSideProps(context) {
    let categories_list = [];
    let sub_categories_list = [];
    await axios.get(urls.GET_REQUEST.CATEGORIES).then((res) => {
        categories_list = res.data.category.docs;
        sub_categories_list = res.data.sub_category.docs;
    }).catch((err) => {
    })
    return {
        props: {
            categories_list,
            sub_categories_list,
        },
    }
}

export default function Product(props) {
    const { isMobile } = DetectDeviceView();
    const router = useRouter();
    const { category, sub_category, product } = router.query;
    const [ref, { x, y, width }] = useDimensions();
    // Alert Stuff
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMsg, setAlertMsg] = useState('');
    const [alerttype, setAlertType] = useState('');

    // Product
    const [productData, setProductData] = useState(null);
    const [productLoading, setProductLoading] = useState(false);
    const [activeImgIndex, setActiveImgIndex] = useState(0);

    // User
    const [user, setUser] = useState({ _id: '', fullName: '', mobile: '', city: '', licenseNo: '', address: '', email: '', status: '', role: '', wishList: '', cart: '', entry_date: '' })
    const [token, setToken] = useState('');
    useEffect(() => {
        setProductLoading(true);
        getProduct();
        const getDecodedToken = async () => {
            const decodedToken = await getDecodedTokenFromStorage();
            if (decodedToken !== null) {
                setUser(decodedToken);
                getUser(decodedToken._id);
                const _token = getTokenFromStorage();
                if (_token !== null)
                    setToken(_token);
            }
        }
        getDecodedToken();
        return () => { }
    }, []);
    async function getProduct() {
        await axios.get(urls.GET_REQUEST.GET_PRODUCT_BY_ID + product).then((res) => {
            setProductData(res.data.data[0]);
            setProductLoading(false);
        }).catch((err) => {
            setProductLoading(false);
            console.log('Get product by id err in profile', err);
        })
    }
    const getUser = async (id) => {
        await axios.get(urls.GET_REQUEST.USER_BY_ID + id).then((res) => {
            setUser(res.data.data[0]);
        }).catch((err) => {
            console.log('Get user err in profile', err);
        })
    }
    // End of User

    // Add to cart
    const [quantity, setQuantity] = useState(1);
    const [cartLoading, setCartLoading] = useState(false);
    const handleSetQuantity = (q) => {
        if (q < 1) {
            setAlertType('error');
            setAlertMsg('Enter valid quantity');
            setShowAlertModal(true);
        } else if (q > productData.stock) {
            setAlertType('error');
            setAlertMsg(`Not enough quantity available, please enter 1-${productData.stock}`);
            setShowAlertModal(true);
        } else {
            setQuantity(q);
        }
    }
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
                if (productData._id === item.p_id) {
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
                    p_id: productData._id,
                    vendor_id: productData.vendor_id,
                    quantity: quantity
                };
                await axios.put(urls.PUT_REQUEST.ADD_TO_CART + user._id, data, {
                    headers: {
                        'authorization': token,
                    }
                }).then(function (res) {
                    setCartLoading(false);
                    setAlertType('success');
                    setAlertMsg('Product Successfully Added to Cart');
                    setShowAlertModal(true);
                    getUser(user._id);
                }).catch(function (err) {
                    setCartLoading(false)
                    setAlertType('error');
                    setAlertMsg('Product Not Added to Cart, Please Try Again Later');
                    setShowAlertModal(true);
                    console.log('Add to cart error:', err);
                });
            }
        }
    }
    // ENd of Add to cart

    // Rating Reviews
    const [rating, setRating] = useState(0)
    const [review, setReview] = useState('')
    const [reviewError, setReviewError] = useState('')

    const [reviewLoading, setReviewLoading] = useState(false)

    function ratingChanged(newRating) {
        setRating(newRating)
    }
    function handleSetRatingReview() {
        setReviewLoading(true)
        axios({
            method: 'PUT',
            url: urls.PUT_REQUEST.ADD_RATING_REVIEW + productData._id,
            headers: { 'authorization': token },
            data: { rating: rating, review: review, c_name: user.fullName }
        }).then(res => {
            setRating(0)
            setReview('')
            setReviewLoading(false)
            setAlertType('success');
            setAlertMsg('Review Added Successfully');
            setShowAlertModal(true);
            getProduct();
        }).catch(err => {
            setReviewLoading(false);
            console.log('review add error:', err);
            setAlertType('error');
            setAlertMsg('Review Failed!\n Please Try Again Later');
            setShowAlertModal(true);
        })
    }

    function handleSetReview(e) {
        setReview(e.target.value)
        setReviewError('')
    }
    // End of Rating Reviews

    return (
        <div className='w-100 h-100' style={{ flex: 1, minHeight: '100%' }}>
            <AlertModal
                onHide={() => setShowAlertModal(false)}
                show={showAlertModal}
                alerttype={alerttype}
                message={alertMsg}
            />
            <Layout
                user={user}
                categories_list={props.categories_list}
                sub_categories_list={props.sub_categories_list}
            />
            <div className='_product'>
                {productLoading ?
                    <Loading />
                    :
                    productData === null || productData === '' ?
                        <NoDataFound />
                        :
                        <>
                            <Row>
                                <Col lg={5} md={5} sm={12} xs={12}>
                                    <Row >
                                        <Col lg={2} md={2} sm={2} xs={2} className='flex-column'>
                                            {productData.imagesUrl && productData.imagesUrl.map((element, index) => (
                                                <SmallImage
                                                    key={index}
                                                    index={index}
                                                    imageUrl={element.imageUrl}
                                                    activeImgIndex={activeImgIndex}
                                                    setActiveImgIndex={() => setActiveImgIndex(index)}
                                                />
                                            ))}
                                        </Col>
                                        <Col lg={10} md={10} sm={10} xs={10}>
                                            <Image
                                                ref={ref}
                                                src={productData.imagesUrl[activeImgIndex].imageUrl}
                                                style={{ minWidth: '100%', maxWidth: '100%', minHeight: width + width / consts.SIZES.IMAGE_HEIGHT_DIVIDE, maxHeight: width + width / consts.SIZES.IMAGE_HEIGHT_DIVIDE }}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg={7} md={7} sm={12} xs={12} className='sm_xs_padding_top'>
                                    <h3 style={{ fontWeight: 'bold' }}>{productData.name}</h3>
                                    <h3 style={{ fontWeight: 'bold', borderBottom: `1px solid ${consts.COLORS.SHADOW}`, color: consts.COLORS.MAIN, padding: '10px 0px 10px 0px' }}>Rs: {productData.price}</h3>
                                    <label className='description' style={{ minHeight: width / 1.5, color: consts.COLORS.GRAY }}>{productData.description}</label>
                                    <Row>
                                        <Col lg={3} md={3} sm={6} xs={6} sm={6}>
                                            <Form.Control
                                                type="number"
                                                size='lg'
                                                value={quantity}
                                                onChange={(e) => handleSetQuantity(e.target.value)}
                                                style={{ borderColor: constants.COLORS.SHADOW, textAlign: 'center' }}
                                            />
                                        </Col>
                                        <Col>
                                            <CustomButton
                                                loading={cartLoading}
                                                disabled={cartLoading}
                                                title={'ADD TO CART'}
                                                size={isMobile ? 'sm' : 'lg'}
                                                onClick={() => handleAddToCart()}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '50px' }}>
                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <Card style={{ width: '100%', minHeight: width }} body>
                                        <Tabs fill variant="tabs" justify defaultActiveKey="description" id="uncontrolled-tab-example" >
                                            <Tab eventKey="description" title="Description" style={{ paddingTop: '50px' }}>
                                                <label style={{ minHeight: width / 1.5, color: consts.COLORS.GRAY }}>{productData.description}</label>
                                            </Tab>
                                            <Tab eventKey="additional" title="Additional information" style={{ paddingTop: '50px' }}>
                                                {productData && productData.specifications && productData.specifications.length > 0 ?
                                                    <Table striped bordered hover>
                                                        <tbody>
                                                            {productData && productData.specifications && productData.specifications.map((element, index) => (
                                                                <tr>
                                                                    <td>{element.name}</td>
                                                                    <td>{element.value}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                    :
                                                    <NoDataFound />
                                                }
                                            </Tab>
                                            <Tab eventKey="reviews" title="Reviews" style={{ paddingTop: '50px' }}>
                                                {productData.rating_review && productData.rating_review ?
                                                    productData.rating_review.reviews.map((element, index) => (
                                                        <div key={index} className='_review'>
                                                            <div>
                                                                <label>{element.c_name}</label>
                                                                <span>{element.entry_date.substring(0, 10)}</span>
                                                            </div>
                                                            {element.review}
                                                            <hr />
                                                        </div>
                                                    ))
                                                    :
                                                    <label className='w-100 h-100 text-center pt-5'>{'No Rewiews'} {user.fullName === '' && ', Signin to Add Review'}</label>
                                                }
                                            </Tab>
                                            {user.role === 'customer' &&
                                                <Tab eventKey="add_reviews" title="Add Review" style={{ paddingTop: '50px' }}>
                                                    <Row style={{ padding: '2% 5%' }}>
                                                        <div className='d-flex flex-row align-items-center justify-content-center mb-2'>
                                                            <h6 style={{ margin: '0px 30px' }}>{'Rate'}</h6>
                                                            <ReactStars
                                                                count={5}
                                                                value={rating}
                                                                half={false}
                                                                onChange={ratingChanged}
                                                                size={25}
                                                                activeColor={"orange"}
                                                            />
                                                        </div>
                                                        <InputGroup className='mt-1 mb-3'>
                                                            <Form.Control
                                                                as="textarea"
                                                                onChange={(e) => handleSetReview(e)}
                                                                isInvalid={reviewError}
                                                                rows="5"
                                                                value={review}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {reviewError}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                        <CustomButton
                                                            loading={reviewLoading}
                                                            disabled={rating == '' ? true : false || reviewLoading}
                                                            title={'ADD'}
                                                            // variant={'success'}
                                                            onClick={handleSetRatingReview}
                                                        />
                                                    </Row>
                                                </Tab>
                                            }
                                        </Tabs>
                                    </Card>
                                </Col>
                            </Row>
                            <RelatedProducts
                                category={category}
                                user={user}
                                getUser={getUser}
                                token={token}
                            />
                        </>
                }
            </div>
            <Footer />
            <StickyBottomNavbar user={user} />
            <style type="text/css">{`
                ._product ._review{
                    margin: 2%;
                    font-size: 12px;
                    color: gray;
                }
                ._product ._review label{
                    color: black;
                    font-size: 14px;
                }
                ._product ._review span{
                    float: right;
                    color: gray;
                    font-size: 12px;
                }
                ._product .description {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 10; /* number of lines to show */
                    -webkit-box-orient: vertical;
                    font-size: 12px;
                    color: ${consts.COLORS.GRAY}
                }
                ._product {
                    min-height: 70vh;
                }
                @media only screen and (max-width: 600px) {
                    ._product {
                        padding: 2% 5%;
                    }
                    ._product .sm_xs_padding_top {
                        padding-top: 20px;
                    }
                }
                @media only screen and (min-width: 600px) {
                    ._product {
                        padding: 2% 5%;
                    }
                    ._product .sm_xs_padding_top {
                        padding-top: 20px;
                    }
                }
                @media only screen and (min-width: 768px) {
                    ._product {
                        padding: 2% 7%;
                    }
                }
                @media only screen and (min-width: 992px) {
                    ._product {
                        padding: 2% 9%;
                    }
                }
                @media only screen and (min-width: 1200px) {
                    ._product {
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

function SmallImage(props) {
    const { index, activeImgIndex, setActiveImgIndex, imageUrl } = props;
    const [ref, { x, y, width }] = useDimensions();
    const { isMobile } = DetectDeviceView();

    return (
        <div style={{ border: index === activeImgIndex ? `2px solid ${consts.COLORS.MAIN}` : 'none', marginTop: '10px', borderRadius: '5px', overflow: 'hidden' }}>
            <Image
                ref={ref}
                src={imageUrl}
                onClick={setActiveImgIndex}
                style={{ minWidth: '100%', maxWidth: '100%', minHeight: width + (width / consts.SIZES.IMAGE_HEIGHT_DIVIDE), maxHeight: width + (width / consts.SIZES.IMAGE_HEIGHT_DIVIDE), cursor: 'pointer' }}
            />
        </div>
    )
}

function RelatedProducts(props) {
    const { category, user, token, getUser } = props;
    const { isMobile } = DetectDeviceView();
    const { PRODUCTS_PAGE_LIMIT_LOADING, PRODUCTS_PAGE_LIMIT_ERROR, PRODUCTS_PAGE_LIMIT_PRODUCTS, PRODUCTS_PAGE_LIMIT_HAS_MORE } =
        getProductsByCategorySubCategoryPageLimit(category, null, '1', isMobile ? '9' : '12');

    return (
        <div>
            <h2 style={{ color: consts.COLORS.GRAY, fontWeight: 'bolder', marginTop: '100px' }}>{'Related Products'}</h2>
            {PRODUCTS_PAGE_LIMIT_PRODUCTS && PRODUCTS_PAGE_LIMIT_PRODUCTS.length > 0 ?
                <Row noGutters className='p-0 m-0'>
                    {PRODUCTS_PAGE_LIMIT_PRODUCTS && PRODUCTS_PAGE_LIMIT_PRODUCTS.map((element, index) => (
                        <Col lg={3} md={4} sm={12} xs={12} key={index} className='p-0 m-0' >
                            <ProductCard
                                user={user}
                                getUser={getUser}
                                token={token}
                                key={index}
                                element={element}
                            />
                        </Col>
                    ))}
                </Row>
                :
                !PRODUCTS_PAGE_LIMIT_LOADING && <NoDataFound />
            }
            {PRODUCTS_PAGE_LIMIT_LOADING && <Loading />}
        </div>
    )
}

