import React, { useState, useEffect, useRef, useCallback } from 'react'
import axios from 'axios'
import { Card, Form, Col, Row, Image, InputGroup, Button, Spinner } from 'react-bootstrap'
import useDimensions from "react-use-dimensions";

import urls from '../../utils/urls'
import constants from '../../constants';
import getCustomersOrdersPageLimit from '../../hooks/customer/getCustomersOrdersPageLimit';
import Loading from '../loading';
import NoDataFound from '../no-data-found';

export default function Orders(props) {
    const [pageNumber, setpageNumber] = useState(1)
    const [orders, setOrders] = useState([])

    const { CUSTOMER_ORDERS_LOADING, CUSTOMER_ORDERS, CUSTOMER_ORDERS_HASMORE } = getCustomersOrdersPageLimit(props._id, props.token, props.status, pageNumber, '5');
    const observer = useRef()
    const lastProducrRef = useCallback((node) => {
        if (CUSTOMER_ORDERS_LOADING) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && CUSTOMER_ORDERS_HASMORE) {
                setpageNumber(pageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [CUSTOMER_ORDERS_LOADING, CUSTOMER_ORDERS_HASMORE]);

    useEffect(() => {
        setOrders([]);
        CUSTOMER_ORDERS && CUSTOMER_ORDERS.forEach((element, index) => {
            getProducts(element, index)
        })
        return () => {
        }
    }, [CUSTOMER_ORDERS])

    async function getProducts(element, index) {
        let _order = {}
        _order['_id'] = element._id
        _order['sub_total'] = element.sub_total
        _order['shippingCharges'] = element.shippingCharges
        _order['entry_date'] = element.entry_date
        _order['code'] = element.code
        let array = []

        for (const e of element.products) {
            let obj = {}
            await axios.get(urls.GET_REQUEST.GET_PRODUCT_BY_ID + e.p_id).then(res => {
                let data = res.data.data[0]
                obj['product'] = data
                obj['quantity'] = e.quantity
            }).catch((error) => {
                console.log('Error', error)
            })
            array.push(obj)
        }
        _order['products'] = array

        setOrders(prevOrder => {
            return [...new Set([...prevOrder, _order])]
        })
    }

    return (
        <div className='orders_style'>
            {!props.isMobile &&
                <label className='heading'>{
                    props.status == 'progress' ?
                        'Progress Orders'
                        :
                        props.status == 'pending' ?
                            'Pending Orders'
                            :
                            props.status == 'cancelled' ?
                                'Cancelled Orders'
                                :
                                props.status == 'delivered' ?
                                    'Delivered Orders'
                                    :
                                    null
                }</label>
            }
            {CUSTOMER_ORDERS && CUSTOMER_ORDERS.length > 0 ?
                <>
                    {props.status == 'progress' || props.status == 'pending' &&
                        <Row className='p-0 m-0 d-flex justify-content-center'>
                            <Form.Label style={{ fontSize: '14px', color: `${constants.COLORS.MAIN}` }}>{'To cancel order, Please contact to admin.'}</Form.Label>
                        </Row>
                    }

                    {orders && orders.map((element, index) =>
                        orders.length == (index + 1) ?
                            <Card key={index} ref={lastProducrRef} >
                                <CardBody element={element} status={props.status} index={index} />
                            </Card>
                            :
                            <Card key={index} >
                                <CardBody element={element} status={props.status} index={index} />
                            </Card>
                    )}
                    {CUSTOMER_ORDERS_LOADING && <Loading />}
                </>
                :
                CUSTOMER_ORDERS_HASMORE ?
                    <Loading />
                    :
                    <NoDataFound />
            }
            <style type="text/css">{`
                .orders_style .card {
                    background: ${constants.COLORS.SECONDARY};
                    margin-bottom: 1.5%;
                }
                .orders_style .img {
                    width: 100%;
                }
                .orders_style ._padding {
                    display: flex;
                    align-items: center;
                    justify-content: center
                    margin: 0%;
                    font-size: 13px;
                }
                .orders_style .card-header {
                    display: inline-flex;
                    align-items: center;
                    font-size: 15px;
                    font-weight: bold;
                    color: ${constants.COLORS.TEXT};
                    border: none;
                    padding-bottom: 0%;
                    background: none;
                }
                .orders_style .heading {
                    font-size: 18px;
                    padding-top: 10px;
                    width: 100%;
                    text-align: center;
                }

                .orders_style .form_label {
                    font-size: 11px;
                    color: ${constants.COLORS.TEXT};
                }
                .orders_style .form_control:disabled {
                    background: none;
                    color: ${constants.COLORS.TEXT};
                    border: none;
                    padding-left: 0%;
                    padding-top: 0%;
                    font-size: 14px;
                    font-weight: bold;
                }
                @media (max-width: 1199px){
                    .orders_style .order_col {
                        padding-left: 0.5%;
                        padding-right: 0.5%;
                    }
                }
                @media (max-width: 767px){
                    .orders_style {
                        padding: 1.5%;
                    }
                    .orders_style .order_col {
                        padding: 0%;
                        margin: 0%;
                    }
                    .orders_style .card-body {
                        padding: 2%;
                    }
                }
            `}</style>
        </div >
    )
}

function CardBody(props) {
    const [ref, { x, y, width }] = useDimensions();
    const { element, status } = props;
    return (
        <Card.Body>
            <Row className='p-0 m-0'>
                <Form.Group as={Col} lg={4} md={4} sm={12} xs={12} className='order_col'>
                    <Form.Label className='form_label'>{'Order ID'}</Form.Label>
                    <InputGroup>
                        <Form.Control
                            className='form_control'
                            value={element._id}
                            disabled={true}
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} lg={4} md={4} sm={6} xs={6} className='order_col'>
                    <Form.Label className='form_label'>{'Placed On'}</Form.Label>
                    <InputGroup>
                        <Form.Control
                            className='form_control'
                            value={element.entry_date.substring(0, 10)}
                            disabled={true}
                        />
                    </InputGroup>
                </Form.Group>
            </Row>
            <Row className='p-0 m-0'> <Form.Group as={Col} lg={4} md={4} sm={6} xs={6} className='order_col'>
                <Form.Label className='form_label'>{'Sub Total'}</Form.Label>
                <InputGroup>
                    <Form.Control
                        className='form_control'
                        value={element.sub_total}
                        disabled={true}
                    />
                </InputGroup>
            </Form.Group>
                <Form.Group as={Col} lg={4} md={4} sm={6} xs={6} className='order_col'>
                    <Form.Label className='form_label'>{'Shipping Charges'}</Form.Label>
                    <InputGroup>
                        <Form.Control
                            className='form_control'
                            value={element.shippingCharges}
                            disabled={true}
                        />
                    </InputGroup>
                </Form.Group>
                <Form.Group as={Col} lg={4} md={4} sm={6} xs={6} className='order_col'>
                    <Form.Label className='form_label'>{'Total'}</Form.Label>
                    <InputGroup>
                        <Form.Control
                            className='form_control'
                            value={parseInt(element.sub_total) + parseInt(element.shippingCharges)}
                            disabled={true}
                        />
                    </InputGroup>
                </Form.Group>
            </Row>
            {element.products && element.products.map((e, i) =>
                <Card key={i} style={{ background: constants.COLORS.WHITE, padding: '1%' }}>
                    <Row className='w-100 p-0 m-0'>
                        <Col lg={1} md={2} sm={2} xs={3} style={{ paddingLeft: '0%' }} className='_padding'>
                            <Image ref={ref} className='img' thumbnail
                                style={{ maxHeight: width + 15 || '200px', minHeight: width + 15 || '200px' }}
                                src={e.product && e.product.imagesUrl && e.product.imagesUrl[0].imageUrl}
                            />
                        </Col>
                        <Col className='_padding'>
                            <div className='p-0 m-0'>{e.product && e.product.name}</div>
                        </Col>
                        <Col style={{ paddingRight: '0%' }} className='_padding' lg={2} md='auto' sm='auto' xs='auto'>
                            <label >{'Quantity'}: {e.quantity}</label>
                        </Col>
                    </Row>
                </Card>
            )}
        </Card.Body>
    )
}