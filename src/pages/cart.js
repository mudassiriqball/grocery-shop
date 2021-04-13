import React, { useState, useEffect, useLayoutEffect } from 'react'
import { Row, Col, Button, Form, Image, Card, Spinner, InputGroup, Nav } from 'react-bootstrap'
import axios from 'axios'
import DetectDeviceView from "../hooks/detect-device-view";
import useDimensions from "react-use-dimensions";
import Router from 'next/router'
React.useLayoutEffect = React.useEffect;
import StripeCheckout from 'react-stripe-checkout';

import constants from '../constants';
import { getTokenFromStorage, checkTokenExpAuth } from '../utils/services/auth';
import CustomButton from '../components/CustomButton'
import AlertModal from '../components/alert-modal'

import CustomFormControl from '../components/custom-form-control';
import CalculateDiscountPrice from '../hooks/customer/calculate-discount';
import Loading from '../components/loading';
import urls from '../utils/urls'
import CssTransition from '../components/customer/CssTransition';

import { ImCart } from 'react-icons/im';
import { FiHome } from 'react-icons/fi';
import { TiPlus } from 'react-icons/ti';
import { AiOutlineDelete } from 'react-icons/ai';
import { FaMinus } from 'react-icons/fa';
import StickyBottomNavbar from '../components/customer/sticky-bottom-navbar';
import Layout from '../components/customer/Layout';
import Footer from '../components/customer/footer';
import { BiDotsVertical } from 'react-icons/bi';

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

export default function Cart(props) {
    const { isMobile } = DetectDeviceView();
    const [ref, { x, y, width }] = useDimensions();
    const [isProcedeOrder, setIsProcedeOrder] = useState(false)
    const [showDotView, setshowDotView] = useState(false);

    const [token, setToken] = useState(null)
    const [user, setUser] = useState({ _id: '', fullName: '', mobile: '', city: '',  address: '', email: '', status: '', role: '', wishList: '', cart: '', entry_date: '' })

    const [cart_list, setCart_list] = useState([])
    const [isCartLoading, setIsCartLoading] = useState(false)
    const [canUpdateCart, setCanUpdateCart] = useState(false);

    const [productsData, setProductsData] = useState([]);
    const [sub_total, setSubTotal] = useState(0)

    // Alert Stuff
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMsg, setAlertMsg] = useState('');
    const [alerttype, setAlertType] = useState('');

    useLayoutEffect(() => {
        async function getData() {
            const _decoded_token = await checkTokenExpAuth();
            if (_decoded_token != null) {
                setUser(_decoded_token);
                getUser(_decoded_token._id);
                const _token = await getTokenFromStorage();
                setToken(_token)
            }
        }
        getData()
        return () => { };
    }, []);
    const getUser = async (id) => {
        setIsCartLoading(true)
        await axios.get(urls.GET_REQUEST.USER_BY_ID + id).then((res) => {
            setUser(res.data.data[0]);
            if (res.data.data[0] !== 'customer')
                setCart_list(res.data.data[0].cart);
            setIsCartLoading(false);
        }).catch((err) => {
            console.log('get user error');
            setIsCartLoading(false)
        })
    }

    useEffect(() => {
        calculateSubTotalPrice();
    }, [productsData])

    useEffect(() => {
        setProductsData([]);
        return () => {
        }
    }, [cart_list]);

    useEffect(() => {
        cart_list && cart_list.forEach((element, index) => {
            getProducts(element, index);
        })
        async function getProducts(element, index) {
            await axios.get(urls.GET_REQUEST.GET_PRODUCT_BY_ID + element.p_id).then(res => {
                let obj = {}
                obj['_id'] = element._id;
                obj['p_id'] = element.p_id;
                obj['vendor_id'] = element.vendor_id;
                obj['product'] = res.data.data[0];
                obj['quantity'] = element.quantity;
                obj['check'] = false;
                obj['isLoading'] = false;
                setProductsData(prevPro => {
                    return [...new Set([...prevPro, obj])];
                })
            }).catch((err) => {
                console.log('Cart product getting err:', err)
            })
        }
        return () => {
            setProductsData([]);
        };
    }, [cart_list]);

    function calculateSubTotalPrice() {
        setSubTotal(0);
        let sum = 0;
        productsData && productsData.forEach(element => {
            let count = (element.product.price - element.product.discount / 100 * element.product.price) * element.quantity;
            let rounded = Math.floor(count);
            let decimal = count - rounded;
            if (decimal > 0) {
                sum += rounded + 1;
            } else {
                sum += rounded
            }
        })
        setSubTotal(sum)
    }

    function handleSetQuantity(quan, index, stock) {
        if (quan < 1) {
            setAlertType('error');
            setAlertMsg('Enter valid quantity');
            setShowAlertModal(true);
        } else if (quan > stock) {
            setAlertType('error');
            setAlertMsg(`Not enough quantity available, please enter 1-${stock}`);
            setShowAlertModal(true);
        } else {
            let copyArray = []
            copyArray = Object.assign([], productsData)
            copyArray[index].quantity = quan;
            setProductsData(copyArray);
        }
    }

    const handleProceedOrder = async () => {
        if (user.role !== 'customer') {
            setAlertType('error');
            setAlertMsg('Please login as customer to proceed.');
            setShowAlertModal(true);
        } else if (user.role === 'customer' && user.status === 'disapproved') {
            setAlertType('error');
            setAlertMsg('Your account is not approved yet, Contact to admin for more information.');
            setShowAlertModal(true);
        } else if (user.role === 'customer' && user.status === 'restricted') {
            setAlertType('error');
            setAlertMsg('Your account is restricted, Contact to admin for more information.');
            setShowAlertModal(true);
        } else
            setIsProcedeOrder(true)
    }

    // Delete Cart Data Single
    async function handleDeleteCart(obj_id, index) {
        let copyArray = []
        copyArray = Object.assign([], productsData)
        copyArray[index].isLoading = true
        setProductsData(copyArray);
        await axios({
            method: 'PUT',
            url: urls.PUT_REQUEST.CLEAR_CART + user._id,
            params: { obj_id: obj_id },
            headers: {
                'authorization': token
            }
        }).then(res => {
            let copyArray = []
            copyArray = Object.assign([], productsData)
            copyArray[index].isLoading = true
            setProductsData(copyArray)
            copyArray.splice(index, 1)
            setProductsData(copyArray);
            setAlertType('success');
            setAlertMsg('Item Removed Successfully from Cart');
            setShowAlertModal(true);
            getUser(user._id);
        }).catch(err => {
            let copyArray = []
            copyArray = Object.assign([], productsData)
            copyArray[index].isLoading = false
            setProductsData(copyArray)
            setAlertType('error');
            setAlertMsg('Cart Item Removed Failed!\nPlease Try Again Later.');
            setShowAlertModal(true);
            console.log('Cart item delete error:', err)
        })
    }

    // End of delete cart

    function handlePlaceOrderError(element) {
        setAlertType('error');
        setAlertMsg('Product stock out of stock, change stock and try again');
        setShowAlertModal(true);
        let copyArray = Object.assign([], productsData)
        let obj = {}
        obj = copyArray[element[0].index]
        obj['err'] = true
        copyArray[element.index] = obj;
        setProductsData(copyArray)
    }

    return (
        <div className='_cart'>
            <Layout
                user={user}
                token={token}
                categories_list={props.categories_list}
                sub_categories_list={props.sub_categories_list}
            />
            <AlertModal
                onHide={(e) => setShowAlertModal(false)}
                show={showAlertModal}
                alerttype={alerttype}
                message={alertMsg}
            />
            {/* <Image style={{
                minWidth: '100%', maxWidth: '100%', minHeight: '100vw', maxHeight: '100vw', border: 'none',
            }}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAACECAYAAABRRIOnAAAAAklEQVR4AewaftIAAAOWSURBVO3BMa5bCxYDwe4D7X/LHAcTMLqAID3722CV+YWZ/ztmyjFTjplyzJRjphwz5Zgpx0w5ZsoxU46ZcsyUY6YcM+WYKS8+pPI7JeEdKi0J36TSktBUfqckfOKYKcdMOWbKiy9Lwjep/CSVJ0loKi0J70jCN6l80zFTjplyzJQXP0zlHUl4h0pLwieS0FR+kso7kvCTjplyzJRjprz4x6g8UXmi0pLQVJpKS8Lf7Jgpx0w5ZsqLf0wSmkpLwjtUWhL+ZcdMOWbKMVNe/LAk/E4qLQlNpSXhSRKaypMkvCMJ/yXHTDlmyjFTXnyZyp+UhKbSktBUWhKaSktCU3mHyn/ZMVOOmXLMlBcfSsJ/iUpLwjeptCQ8ScLf5Jgpx0w5Zor5hQ+otCQ0lW9KwhOVloSm8o4kNJUnSWgq35SEn3TMlGOmHDPlxYeS8E1JeKLSkvBE5UkSmkpTaUl4otKS8Dc5ZsoxU46Z8uI3S0JTeaLyjiQ0lScqLQlPVFoSWhKaSkvCE5WWhKbyJAmfOGbKMVOOmWJ+4YtUWhKaSkvCO1Q+kYR3qLQkPFFpSXii8iQJv9MxU46ZcsyUF3+YSktCU2lJaCrvUGlJaCotCU3lSRKayjuS0FTekYRPHDPlmCnHTDG/8AGVloSm8okkNJV3JOGJSktCU2lJeKLSkvA3OWbKMVOOmfLihyXhEyo/KQlPktBUWhKeqLQkNJVvSsInjplyzJRjprz4YSotCU9UWhKaSktCU2kqLQlNpSWhqbwjCU2lqbQkNJWWhKbyk46ZcsyUY6a8+GFJaCotCU9UWhKaypMkvEOlJaGpNJVPqLQkNJXf6Zgpx0w5Zor5hb+YypMkfEKlJaGptCS8Q+VJEppKS8I3HTPlmCnHTHnxIZXfKQktCU9U/iSVloQnSXiShKbSkvCJY6YcM+WYKS++LAnfpPJE5UkSmkpLwhOVpvKOJPxNjplyzJRjprz4YSrvSMInktBUnqh8k8onVJ4koSXhm46ZcsyUY6a8+MeotCQ8UWlJ+ITKJ5LwROVJEj5xzJRjphwz5cU/TqUl4R0qLQlPkvAJlZaEloSm8k3HTDlmyjFTXvywJPykJDSVJyrfpPJNSfiTjplyzJRjprz4MpXfSeVJEp6oNJUnKi0JTeVJEp6o/EnHTDlmyjFTzC/M/N8xU46ZcsyUY6YcM+WYKcdMOWbKMVOOmXLMlGOmHDPlmCnHTPkf8smNMyWa6OgAAAAASUVORK5CYII=" alt="Card image" /> */}

            <Card className="text-black" style={{ background: `${constants.COLORS.WHITE}`, border: 'none' }}>

                <Card.Img src="cart_background.jpg" alt="Card image"
                    style={{
                        minWidth: '100%', maxWidth: '100%', minHeight: isMobile ? '60vw' : '35vw', maxHeight: isMobile ? '60vw' : '35vw', border: 'none',
                        borderBottomLeftRadius: '20%', borderBottomRightRadius: '20%',
                        borderBottom: `5px solid ${constants.COLORS.MAIN}`,
                    }} />
                <Card.ImgOverlay className='justify-content-center flex align-items-center'>
                    <Card.Title style={{ fontSize: isMobile ? '25px' : '70px', fontWeight: 'bolder', color: `${constants.COLORS.MAIN}` }}>CART</Card.Title>
                    <Card.Text style={{ fontSize: isMobile ? '16px' : '30px', fontWeight: 'bolder', color: `${constants.COLORS.MAIN}` }}>Your Partner for Medical Cannabis</Card.Text>
                    <div className='d-flex flex-row justify-content-center flex' style={{ position: 'absolute', bottom: isMobile ? '-30px' : '-40px', left: '0px', right: '0px' }}>
                        <div className='cart_link'>
                            <Nav.Link href="/" style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: isMobile ? '60px' : '80px',
                                height: isMobile ? '60px' : '80px',
                                color: 'whitesmoke'
                            }}>
                                <FiHome style={{
                                    color: constants.COLORS.WHITE,
                                    fontSize: '30px',
                                    alignSelf: 'center'
                                }} />
                            </Nav.Link>
                        </div>
                        <div className='cart_link'>
                            <Nav.Link href="#" style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: isMobile ? '60px' : '80px',
                                height: isMobile ? '60px' : '80px',
                                color: 'whitesmoke'
                            }}>
                                <ImCart style={{
                                    color: constants.COLORS.WHITE,
                                    fontSize: '30px',
                                    alignSelf: 'center'
                                }}
                                />
                            </Nav.Link>
                        </div>
                        <div className='cart_link'>
                            <Nav.Link href="#" onClick={() => setshowDotView(!showDotView)} style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: isMobile ? '60px' : '80px',
                                height: isMobile ? '60px' : '80px',
                                color: 'whitesmoke'
                            }}>
                                <BiDotsVertical style={{
                                    color: constants.COLORS.WHITE,
                                    fontSize: '30px',
                                    alignSelf: 'center'
                                }} />
                            </Nav.Link>
                        </div>
                    </div>
                </Card.ImgOverlay>
            </Card>
            <CssTransition show={showDotView} hide={() => setshowDotView(false)} />
            <label style={{ fontSize: isMobile ? '17px' : '20px', color: `${constants.COLORS.MAIN}`, fontWeight: 'bold', textAlign: 'center', marginTop: isMobile ? '40px' : '100px', width: '100%' }}>{'----  SHOPPING  ----'}</label>
            <label style={{ fontSize: isMobile ? '21px' : '30px', color: `${constants.COLORS.SEC}`, fontWeight: 1000, textAlign: 'center', marginTop: '10px', width: '100%' }}>{'CART DATA'}</label>

            {/* Cart Data */}
            <div className='cart'>
                {isProcedeOrder ?
                    <ProcedeOrder
                        productsData={productsData}
                        token={token}
                        user={user}
                        cancel={() => setIsProcedeOrder(false)}
                        sub_total={sub_total}
                        handlePlaceOrderError={handlePlaceOrderError}
                    />
                    :
                    isCartLoading ?
                        <Loading />
                        :
                        <>
                            <Row>
                                <Col lg={12} md={12} sm={12} xs={12}>
                                    <Card style={{ border: `1px solid ${constants.COLORS.LIGHT_GRAY}`, boxShadow: `0px 0px 10px 0.5px ${constants.COLORS.LIGHT_GRAY}`, borderRadius: '0px' }}>
                                        {!isMobile &&
                                            <Card.Header className='pb-0 mb-0 bl-0 br-0'>
                                                <Row noGutters>
                                                    <Col lg={4} md={4} sm={12} xs={12} className='d-flex justify-content-center align-items-center'>
                                                        <Card.Title>Product</Card.Title>
                                                    </Col>
                                                    <Col lg={3} md={3} sm={12} xs={12} className='d-flex justify-content-center align-items-center'>
                                                        <Card.Title>Quantity</Card.Title>
                                                    </Col>
                                                    <Col lg={2} md={2} sm={12} xs={12} className='d-flex justify-content-center align-items-center'>
                                                        <Card.Title>Discount</Card.Title>
                                                    </Col>
                                                    <Col lg={3} md={3} sm={12} xs={12} className='d-flex justify-content-center align-items-center'>
                                                        <Card.Title>Total</Card.Title>
                                                    </Col>
                                                </Row>
                                            </Card.Header>
                                        }
                                        {productsData === '' ?
                                            <h6 className='w-100 text-center p-5' style={{ color: constants.COLORS.GRAY }}>{'No Data Found'}</h6>
                                            :
                                            productsData.map((element, index) =>
                                                <Card key={element._id} style={{ borderBottom: `1px solid ${constants.COLORS.SHADOW}` }}>
                                                    <Card.Body className='card_body' style={{ border: element.err ? '1px solid red' : null }}>
                                                        {/* Delete */}
                                                        {element.isLoading ?
                                                            <Spinner animation='border' variant="danger" />
                                                            :
                                                            <AiOutlineDelete onClick={() => handleDeleteCart(element._id, index)} style={{ fontSize: isMobile ? '20px' : '30px', color: constants.COLORS.DANGER, marginRight: isMobile ? '5px' : '10px', cursor: 'pointer' }} />
                                                        }
                                                        <Row className='w-100'>
                                                            {/* Image / Name */}
                                                            <Col lg={4} md={4} sm={6} xs={6} className='d-flex flex-row  align-items-center'>
                                                                <Image ref={ref} className='cart_img'
                                                                    style={{ maxHeight: width + width / constants.SIZES.IMAGE_HEIGHT_DIVIDE, minHeight: width + width / constants.SIZES.IMAGE_HEIGHT_DIVIDE }}
                                                                    src={element.product && element.product.imagesUrl && element.product.imagesUrl[0].imageUrl}
                                                                />
                                                                {/* Name */}
                                                                <div className='p-0 m-3'
                                                                    style={{
                                                                        textOverflow: 'ellipsis',
                                                                        overflow: 'hidden',
                                                                        whiteSpace: 'nowrap'
                                                                    }}
                                                                >
                                                                    {element.product && element.product.name}
                                                                </div>
                                                            </Col>
                                                            {/* Quantity */}
                                                            <Col lg={3} md={3} sm={6} xs={6} className='d-flex justify-content-center align-items-center'>
                                                                <Form.Control
                                                                    type="number"
                                                                    size='lg'
                                                                    disabled={!canUpdateCart}
                                                                    value={element.quantity}
                                                                    onChange={(e) => handleSetQuantity(e.target.value, index, element.product.stock)}
                                                                    style={{ borderColor: constants.COLORS.SHADOW, textAlign: 'center' }}
                                                                />
                                                            </Col>
                                                            {/* Discount */}
                                                            <Col lg={2} md={2} sm={6} xs={6} className='d-flex justify-content-center align-items-center'>
                                                                <label className='p-0 m-0' style={{ color: constants.COLORS.SEC }}>
                                                                    {element.product.discount || 0}{'%'}
                                                                    {element.product && element.product.discount > 0 && <span style={{ textDecorationLine: 'line-through', color: constants.COLORS.GRAY, fontSize: '12px', marginLeft: '5px' }}>{'Rs.'}{element.product.price * element.quantity}</span>}
                                                                </label>
                                                            </Col>
                                                            {/* Total */}
                                                            <Col lg={3} md={3} sm={6} xs={6} className='d-flex justify-content-center align-items-center'>
                                                                <h6 className='p-0 m-0' style={{ color: constants.COLORS.MAIN, fontWeight: 'bold' }}>
                                                                    {'Rs: '}
                                                                    <CalculateDiscountPrice price={element.product.price * element.quantity} discount={element.product.discount} />
                                                                </h6>
                                                            </Col>
                                                        </Row>
                                                    </Card.Body>
                                                </Card>
                                            )}
                                    </Card>
                                </Col>
                                <Col lg={12} md={12} sm={12} xs={12} className='d-flex flex-row pt-5 pl-2 pr-2' style={{ justifyContent: 'center' }}>
                                    <CustomButton
                                        block={productsData === '' ? false : true}
                                        size={productsData === '' ? 'lg' : 'sm'}
                                        title={'CONTINUE SHOPPING'}
                                        onClick={() => Router.push('/')}
                                    />
                                    {cart_list.length > 0 && productsData && productsData.length > 0 ?
                                        <>
                                            <div className='w-75' />
                                            {canUpdateCart ?
                                                <CustomButton
                                                    block
                                                    title={'CANCEL UPDATE'}
                                                    onClick={() => { setCanUpdateCart(false), Router.reload() }}
                                                />
                                                :
                                                <CustomButton
                                                    block
                                                    title={'UPDATE CART'}
                                                    onClick={() => setCanUpdateCart(true)}
                                                />}
                                        </>
                                        :
                                        null
                                    }
                                </Col>
                            </Row>
                            <div style={{ borderBottom: `1px solid ${constants.COLORS.SHADOW}`, minHeight: '50px', minWidth: '100%', marginBottom: '20px' }} />
                            {/* Order SUmmery Before */}
                            <Row style={{ paddingBottom: isMobile ? '20px' : '0px' }}>
                                <Col></Col>
                                <Col lg={6} md={6} sm={12} xs={12}>
                                    <Card style={{ border: `1px solid ${constants.COLORS.LIGHT_GRAY}`, boxShadow: `0px 0px 10px 0.5px ${constants.COLORS.SHADOW}`, borderRadius: '0px' }}>
                                        <Card.Body>
                                            <h3 style={{ color: constants.COLORS.GRAY, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>{'Order Summary'}</h3>
                                            <div style={{ padding: '20px' }}>
                                                <div className='d-inline-flex w-100 mt-4' style={{ fontSize: '14px', color: constants.COLORS.TEXT }}>
                                                    <h6 className='mr-auto'>{'Sub Total'}</h6>
                                                    <h6>{'Rs.'}{sub_total}</h6>
                                                </div>
                                                <div className='d-inline-flex w-100 mt-2' style={{ fontSize: '14px', color: constants.COLORS.TEXT }}>
                                                    <h6 className='mr-auto'>{'Shipping Charges'}</h6>
                                                    <h6>{'Rs.'}{'0'}</h6>
                                                </div>
                                                <hr style={{ color: constants.COLORS.SHADOW }} />
                                                <div className='d-inline-flex w-100 mb-2' style={{ fontSize: '14px', color: constants.COLORS.TEXT }}>
                                                    <h6 className='mr-auto'>{'Total'}</h6>
                                                    <h6>{'Rs.'}{sub_total}</h6>
                                                </div>
                                            </div>
                                            <CustomButton
                                                title={'PROCEED TO CHECKOUT'}
                                                onClick={() => handleProceedOrder()}
                                                disabled={user.role !== 'customer' || (productsData && productsData.length < 1)}
                                                block
                                            >
                                            </CustomButton>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </>
                }
            </div>
            <Footer />
            <StickyBottomNavbar user={user} />
            <style type="text/css">{`
                .cart_link {
                    border-radius: 20px;
                    overflow: hidden;
                    margin: 0px 2px;
                    background: ${constants.COLORS.MAIN};
                }
                .cart_link:hover {
                    background: ${constants.COLORS.SEC};
                }
                .cart{
                    padding: 2% 15%;
                    min-height: 75vh;
                }
                .cart .card{
                    border: none;
                }
                .cart .card_body{
                    display: inline-flex;
                    align-items: center;
                    padding: 1%;
                    margin: 0%;
                }
                .cart_img{
                    width: 50px;
                }
                @media (max-width: 1199px){
                    .cart{
                        padding: 2% 12%;
                    }
                }
                @media (max-width: 991px){
                    .cart{
                        padding: 2% 9%;
                    }
                }
                 @media (max-width: 767px){
                    .cart{
                        padding: 2% 7%;
                    }
                }
                 @media (max-width: 575px){
                    .cart{
                        padding: 2% 5%;
                    }
                }
            `}</style>
            <style jsx>{`
                ._cart {
                    min-height: 100vh;
                    background: ${constants.COLORS.WHITE};
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                }
            `}</style>
            <style jsx global>{`
                * {
                    font-family: Oswald,sans-serif;
                }
            `}</style>
        </div >
    )
}

function ProcedeOrder(props) {
    const { isMobile } = DetectDeviceView();
    const { productsData, token, user, cancel, sub_total, handlePlaceOrderError } = props;
    const [cardRef, cardSize] = useDimensions();
    console.log('user', user);

    const [loading, setLoading] = useState(false)

    const [name, setName] = useState(user.fullName)
    const [city, setCity] = useState(user.city)
    const [mobile, setMobile] = useState(user.mobile)
    const [address, setAddress] = useState(user.address)

    const [nameError, setNameError] = useState('')
    const [cityError, setCityError] = useState('')
    const [mobError, setMobError] = useState('')
    const [addressError, setAddressError] = useState('')

    // Alert Stuff
    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertMsg, setAlertMsg] = useState('');
    const [alerttype, setAlertType] = useState('');

    // Payment
    const [cashOnDeliveryChecked, setCashOnDeliveryChecked] = useState(false);
    const [onlinePaymentChecked, setOnlinePaymentChecked] = useState(false);

    const handlePlaceOrder = async (_token) => {
        if (user.role === 'customer' && user.status === 'disapproved') {
            setAlertType('error');
            setAlertMsg('Your account is not approved yet, Contact to admin for more information');
            setShowAlertModal(true);
        } else if (user.role === 'customer' && user.status === 'restricted') {
            setAlertType('error');
            setAlertMsg('Your account is restricted, Contact to admin for more information');
            setShowAlertModal(true);
        } else if (name == '' || city == '' || mobile == '' || address == '') {
            setAlertType('error');
            setAlertMsg('Please Enter All Required Fields in Personel Information!');
            setShowAlertModal(true);
            if (name == '') {
                setNameError('Enter Value');
            }
            if (city == '') {
                setCityError('Enter Value')
            }
            if (mobile == '') {
                setMobError('Enter Value')
            }
            if (address == '') {
                setAddressError('Enter Value')
            }
        } else {
            setLoading(true)
            let data = []
            productsData.forEach((element, index) => {
                data.push({
                    'vendor_id': element.product.vendor_id,
                    'p_id': element.p_id,
                    'quantity': element.quantity,
                })
            })

            let body = {};
            if (_token) {
                body = {
                    token: _token,
                    price: sub_total,
                    currency: 'usd',
                    c_name: name,
                    city: city,
                    mobile: mobile,
                    address: address,
                    sub_total: sub_total,
                    shippingCharges: '0',
                    paymentType: cashOnDeliveryChecked ? 'cash' : 'online',
                    products: data,
                }
            } else {
                body = {
                    c_name: name,
                    city: city,
                    mobile: mobile,
                    address: address,
                    sub_total: sub_total,
                    shippingCharges: '0',
                    paymentType: cashOnDeliveryChecked ? 'cash' : 'online',
                    products: data,
                }
            }
            await axios.post(urls.POST_REQUEST.PLACE_ORDER + user._id, body,
                {
                    headers: {
                        'authorization': token
                    }
                }).then((res) => {
                    setLoading(false)
                    if (res.data.code == 200) {
                        setAlertType('success');
                        setAlertMsg('Your Order Placed Successfully');
                        setShowAlertModal(true);
                        handleClearCart();
                    } else if (res.data.code == 201) {
                        cancel();
                        handlePlaceOrderError(res.data.data);
                        setAlertType('error');
                        setAlertMsg('Quantity Out of Stock, Please Refresh the Page and Update Quantity.');
                        setShowAlertModal(true);
                    }
                }).catch((err) => {
                    setLoading(false)
                    console.log('Order Place Failed:', err)
                    setAlertType('error');
                    setAlertMsg('Order Place Failed, Please Try Agian Later.');
                    setShowAlertModal(true);
                })
        }
    }

    const handleClearCart = async () => {
        await axios({
            method: 'DELETE',
            url: urls.DELETE_REQUEST.DELETE_CART + user._id,
            headers: {
                'authorization': token
            }
        }).then(res => {
            setTimeout(() => {
                Router.reload();
            }, 1000);
        }).catch(err => {
            console.log('Clear Cart Data Failed Error:', err)
        })
    }

    function handleSetCity(city) {
        setCity(city)
        setCityError('')
    }

    return (
        <div className='proced_order'>
            <AlertModal
                onHide={(e) => setShowAlertModal(false)}
                show={showAlertModal}
                alerttype={alerttype}
                message={alertMsg}
            />
            <Row>
                <Col lg={12} md={12} sm={12} xs={12}>
                    <Card style={{ border: `1px solid ${constants.COLORS.LIGHT_GRAY}`, boxShadow: `0px 0px 10px 0.5px ${constants.COLORS.LIGHT_GRAY}`, borderRadius: '0px' }}>
                        <Card.Body>
                            <h3 style={{ color: constants.COLORS.GRAY, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>{'Personel Information'}</h3>
                            <div style={{ padding: '20px' }}>
                                <Row className='p-0 m-0'>
                                    <Col lg={4} md={4} sm={12} xs={12}>
                                        <Form.Label className='field_label'>{'Full Name'} <span> * </span> </Form.Label>
                                        <InputGroup>
                                            <CustomFormControl
                                                placeholder='Enter Full Name'
                                                type="text"
                                                value={name}
                                                onChange={(e) => { setName(e.target.value), setNameError('') }}
                                            />
                                            <Form.Row className='err'> {nameError} </Form.Row>
                                        </InputGroup>
                                    </Col>
                                    <Col lg={4} md={4} sm={6} xs={12}>
                                        <Form.Label className='field_label'>{'City'} <span> * </span></Form.Label>
                                        <InputGroup>
                                            <CustomFormControl
                                                placeholder='Enter City'
                                                type="text"
                                                value={city}
                                                onChange={(e) => handleSetCity(e.target.value)}
                                            />
                                            <Form.Row className='err'> {cityError} </Form.Row>
                                        </InputGroup>
                                    </Col>
                                    <Col lg={4} md={4} sm={6} xs={12}>
                                        <Form.Label className='field_label'>{'Mobile Number'}  <span> * </span> </Form.Label>
                                        <InputGroup>
                                            <Form.Control
                                                type='number'
                                                placeholder='+966590911891'
                                                value={mobile}
                                                onChange={(e) => { setMobile(e.target.value), setMobError('') }}
                                            />
                                            <Form.Row className='err'> {mobError} </Form.Row>
                                        </InputGroup>
                                    </Col>
                                </Row>
                                <Row className='p-0 ml-0 mb-0 mr-0 mt-2'>
                                    <Col lg={12} md={12} sm={12} xs={12}>
                                        <Form.Label className='field_label'> {'Address'} <span> * </span> </Form.Label>
                                        <InputGroup>
                                            <CustomFormControl
                                                placeholder='Enter Address'
                                                type="text"
                                                value={address}
                                                onChange={(e) => { setAddress(e.target.value), setAddressError('') }}
                                            />
                                            <Form.Row className='err'> {addressError} </Form.Row>
                                        </InputGroup>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Order SUmmery */}
            <Row style={{ marginTop: '3%' }}>
                <Col lg={6} md={6} sm={12} xs={12} style={{ paddingBottom: isMobile ? '3%' : '0px' }}>
                    <Card ref={cardRef} style={{ border: `1px solid ${constants.COLORS.LIGHT_GRAY}`, boxShadow: `0px 0px 10px 0.5px ${constants.COLORS.LIGHT_GRAY}`, borderRadius: '0px' }}>
                        <Card.Body>
                            <h3 style={{ color: constants.COLORS.GRAY, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>{'Order Summary'}</h3>
                            <div style={{ padding: '20px' }}>
                                <div className='d-inline-flex w-100 mt-4' style={{ fontSize: '14px', color: constants.COLORS.TEXT }}>
                                    <h6 className='mr-auto'>{'Sub Total'}</h6>
                                    <h6>{'Rs. '}{sub_total + ''}</h6>
                                </div>
                                <div className='d-inline-flex w-100 mt-2' style={{ fontSize: '14px', color: constants.COLORS.TEXT }}>
                                    <h6 className='mr-auto'>{'Shipping Charges'}</h6>
                                    <h6>{'Rs. '}{'0'}</h6>
                                </div>
                                <hr style={{ color: constants.COLORS.SHADOW }} />
                                <div className='d-inline-flex w-100 mb-2' style={{ fontSize: '14px', color: constants.COLORS.TEXT }}>
                                    <h6 className='mr-auto'>{'Total'}</h6>
                                    <h6>{'Rs. '}{sub_total}</h6>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                {/* Payment Options */}
                {/* 0340-0154994 */}
                <Col lg={6} md={6} sm={12} xs={12} style={{ paddingBottom: isMobile ? '3%' : '0px' }}>
                    <Card style={{ border: `1px solid ${constants.COLORS.LIGHT_GRAY}`, boxShadow: `0px 0px 10px 0.5px ${constants.COLORS.LIGHT_GRAY}`, borderRadius: '0px', minHeight: cardSize.height, maxHeight: cardSize.height }}>
                        <Card.Body className='d-flex flex-column'>
                            <h3 style={{ color: constants.COLORS.GRAY, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>{'Payment Option'}</h3>
                            <div style={{ padding: '20px', marginTop: 'auto', marginBottom: 'auto' }}>
                                <Row>
                                    <Col>
                                        <Form.Group controlId="delivery" className='d-flex flex-row'>
                                            <Form.Label>Cash on Delivery</Form.Label>
                                            <Form.Check type="switch" checked={cashOnDeliveryChecked} onChange={(e) => { setCashOnDeliveryChecked(!cashOnDeliveryChecked), setOnlinePaymentChecked(false) }} label="" style={{ marginLeft: '20px' }} />
                                        </Form.Group>
                                        <Form.Group controlId="online" className='d-flex flex-row'>
                                            <Form.Label>Online Payment</Form.Label>
                                            <Form.Check type="switch" checked={onlinePaymentChecked} onChange={(e) => { setOnlinePaymentChecked(!onlinePaymentChecked), setCashOnDeliveryChecked(false) }} label="" style={{ marginLeft: '20px' }} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/* Confirm Order */}
            <Card style={{ border: `1px solid ${constants.COLORS.LIGHT_GRAY}`, boxShadow: `0px 0px 10px 0.5px ${constants.COLORS.LIGHT_GRAY}`, borderRadius: '0px', marginTop: '3%' }}>
                <Card.Body className='d-flex flex-column'>
                    <h3 style={{ color: constants.COLORS.GRAY, fontWeight: 'bold', width: '100%', textAlign: 'center' }}>{'Cofirm Order'}</h3>
                    <div style={{ padding: '20px' }}>
                        <Row style={{ marginBottom: '5%' }}>
                            <Col>
                                <label>{'Please First Select Payment Method'}</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} md={6} sm={12} xs={12}>
                                <CustomButton
                                    block
                                    title={'BACK'}
                                    onClick={cancel}
                                    disabled={loading}
                                />
                            </Col>
                            <Col lg={6} md={6} sm={12} xs={12} style={{ paddingTop: isMobile ? '3%' : '0%' }}>
                                {onlinePaymentChecked ?
                                    <StripeCheckout
                                        token={handlePlaceOrder}
                                        name="Pay"
                                        stripeKey={constants.STRIPE.STRIPE_PUBLIC_KEY}
                                        price={sub_total * 100}
                                        disabled={loading}
                                    >
                                        <CustomButton
                                            size={'md'}
                                            block
                                            title={'CONFIRM ORDER'}
                                            loading={loading}
                                            disabled={loading}
                                        />
                                    </StripeCheckout>
                                    :
                                    <CustomButton
                                        size={'md'}
                                        block
                                        loading={loading}
                                        title={'CONFIRM ORDER'}
                                        onClick={() => handlePlaceOrder(null)}
                                        disabled={!cashOnDeliveryChecked && !onlinePaymentChecked ? true : loading ? true : false}
                                    />
                                }
                            </Col>
                        </Row>
                    </div>
                </Card.Body>
            </Card>
            <style type="text/css">{`
                .proced_order {
                    padding: 5% 0%;
                }
                .proced_order .field_label {
                    font-size: 12px;
                }
                .proced_order .rs_label {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    color: gray;
                }
                .proced_order .center {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 13px;
                    color: blue;
                }
                .proced_order .err {
                    color: ${constants.COLORS.ERROR};
                    margin-left: 2px;
                    font-size: 12px;
                    width: 100%;
                }
            `}</style>
            <style jsx global>{`
                * {
                    font-family: Oswald,sans-serif;
                }
            `}</style>
        </div >
    )
}