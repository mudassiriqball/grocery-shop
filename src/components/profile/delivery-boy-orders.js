import React, { useState, useRef, useCallback } from 'react'
import { Card, Form, Col, Row, InputGroup } from 'react-bootstrap'
import constants from '../../constants';
import Loading from '../loading';
import NoDataFound from '../no-data-found';
import getDeliveryBoyOrdersPageLimit from '../../hooks/delivery/getDeliveryBoyOrdersPageLimit';

export default function DeliveryBoyOrders(props) {
    const [pageNumber, setpageNumber] = useState(1);

    const { DELIVERY_BOY_ORDERS_LOADING, DELIVERY_BOY_ORDERS, DELIVERY_BOY_ORDERS_HASMORE } = getDeliveryBoyOrdersPageLimit(props._id, props.token, props.status, pageNumber, '5');
    const observer = useRef()
    const lastProducrRef = useCallback((node) => {
        if (DELIVERY_BOY_ORDERS_LOADING) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && DELIVERY_BOY_ORDERS_HASMORE) {
                setpageNumber(pageNumber + 1)
            }
        })
        if (node) observer.current.observe(node)
    }, [DELIVERY_BOY_ORDERS_LOADING, DELIVERY_BOY_ORDERS_HASMORE]);

    return (
        <div className='delivery_orders_style'>
            {!props.isMobile &&
                <label className='heading'>{
                    props.status == 'progress' ?
                        'Progress Orders'
                        :
                        props.status == 'delivered' ?
                            'Delivered Orders'
                            :
                            null
                }</label>
            }
            {DELIVERY_BOY_ORDERS && DELIVERY_BOY_ORDERS.length > 0 ?
                <>
                    {props.status == 'progress' || props.status == 'pending' &&
                        <Row className='p-0 m-0 d-flex justify-content-center'>
                            <Form.Label style={{ fontSize: '14px', color: `${constants.COLORS.MAIN}` }}>{'To cancel order, Please contact to admin.'}</Form.Label>
                        </Row>
                    }
                    {DELIVERY_BOY_ORDERS && DELIVERY_BOY_ORDERS.map((element, index) =>
                        DELIVERY_BOY_ORDERS.length == (index + 1) ?
                            <Card key={index} ref={lastProducrRef} >
                                <CardBody element={element} status={props.status} index={index} />
                            </Card>
                            :
                            <Card key={index} >
                                <CardBody element={element} status={props.status} index={index} />
                            </Card>
                    )}
                    {DELIVERY_BOY_ORDERS_LOADING && <Loading />}
                </>
                :
                DELIVERY_BOY_ORDERS_LOADING ?
                    <Loading />
                    :
                    <NoDataFound />
            }
            <style type="text/css">{`
                .delivery_orders_style .card {
                    background: ${constants.COLORS.SECONDARY};
                    margin-bottom: 1.5%;
                }
                .delivery_orders_style .card-header {
                    display: inline-flex;
                    align-items: center;
                    font-size: 15px;
                    font-weight: bold;
                    color: ${constants.COLORS.TEXT};
                    border: none;
                    padding-bottom: 0%;
                    background: none;
                }
                .delivery_orders_style .heading {
                    font-size: 18px;
                    padding-top: 10px;
                    width: 100%;
                    text-align: center;
                }

                .delivery_orders_style .form_label {
                    font-size: 11px;
                    color: ${constants.COLORS.TEXT};
                }
                .delivery_orders_style .form_control:disabled {
                    background: none;
                    color: ${constants.COLORS.TEXT};
                    border: none;
                    padding-left: 0%;
                    padding-top: 0%;
                    font-size: 14px;
                    font-weight: bold;
                }
                @media (max-width: 1199px){
                    .delivery_orders_style .order_col {
                        padding-left: 0.5%;
                        padding-right: 0.5%;
                    }
                }
                @media (max-width: 767px){
                    .delivery_orders_style {
                        padding: 1.5%;
                    }
                    .delivery_orders_style .order_col {
                        padding: 0%;
                        margin: 0%;
                    }
                    .delivery_orders_style .card-body {
                        padding: 2%;
                    }
                }
            `}</style>
        </div >
    )
}

function CardBody(props) {
    const { element } = props;
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
                <Form.Group as={Col} lg={4} md={4} sm={12} xs={12} className='order_col'>
                    <Form.Label className='form_label'>{'Status'}</Form.Label>
                    <InputGroup>
                        <Form.Control
                            className='form_control'
                            value={element.status}
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
        </Card.Body>
    )
}