import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Router from 'next/router'
import Link from 'next/link'
import { Image, Row, Col, Card } from 'react-bootstrap'
import useDimensions from "react-use-dimensions";
import NoDataFound from '../no-data-found'
import consts from '../../constants'
import urls from '../../utils/urls'

export default function WishlistScreen(props) {
    const [my_wishlist, setMy_wishlist] = useState([])
    const [ref, { x, y, width }] = useDimensions();

    useEffect(() => {
        setMy_wishlist([])
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        if (props.role != 'customer') {
            Router.push('/login');
        } else {
            props.wish_list && props.wish_list.forEach((element, index) => {
                getProducts(element, index)
            })
        }

        async function getProducts(element, index) {
            await axios.get(urls.GET_REQUEST.GET_PRODUCT_BY_ID + element.product_id, { cancelToken: source.token }).then(res => {
                if (unmounted) {
                    let obj = {}
                    obj['_id'] = element._id
                    obj['product_id'] = element.product_id
                    obj['product'] = res.data.data[0]
                    obj['isLoading'] = false
                    setMy_wishlist(prev => {
                        return [...new Set([...prev, obj])]
                    })
                }
            }).catch((error) => {
                if (unmounted) {
                    // alert('Error')
                }
            })
        }

        return () => {
            unmounted = false
            source.cancel();
        }
    }, [props.wish_list])

    async function removeToWishlist(obj_id, index) {
        let copyArray = Object.assign([], my_wishlist)
        let obj = copyArray[index]
        obj['isLoading'] = true
        setMy_wishlist(copyArray)
        await axios({
            method: 'PUT',
            url: urls.PUT_REQUEST.REMOVE_ITEM_TO_WISHLIST + props._id,
            params: { object_id: obj_id },
            headers: {
                'authorization': props.token,
            }
        }).then(res => {
            props.reloadUser()
        }).catch(err => {
            obj['isLoading'] = false
            setMy_wishlist(copyArray)
            console.log('remove to wishlist error:', err)
            alert('ERROR')
        })
    }

    return (
        <div className='wishlist'>
            {!props.isMobile && <label className='heading'>{'My Wishlist'}</label>}
            {my_wishlist == '' ?
                <NoDataFound />
                :
                <div>
                    {my_wishlist && my_wishlist.map((element, index) =>
                        <Card key={index} >
                            <Card.Body>
                                <Row className='w-100 p-0 m-0'>
                                    <Col lg={2} md={2} sm={2} xs={3} style={{ paddingLeft: '0%' }} className='_padding'>
                                        <Image ref={ref} className='img' thumbnail
                                            style={{ maxHeight: width + 15 || '200px', minHeight: width + 15 || '200px' }}
                                            src={element.product.product_image_link[0].url}
                                        />
                                    </Col>
                                    <Col className='_padding flex-column justify-content-center'>
                                        <div className='p-0 m-0'>{element.product.product_name}</div>
                                        <label>{'Rs. '}{element.product.product_price}</label>
                                    </Col>
                                    <Col className='_padding' lg={2} md='auto' sm='auto' xs='auto'>
                                        <Link href='/products/category/[category]/[sub_category]/[product]' as={`/products/category/${element.product.category.value}/${element.product.sub_category.value}/${element.product._id}`}>
                                            <a style={{ fontSize: '12px', marginRight: '10px' }}>{'View'}</a>
                                        </Link>
                                        <div className='delete' onClick={() => removeToWishlist(element._id, index)}>
                                            <div>{element.isLoading ? 'Deleting' : 'Delete'}</div>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    )}
                </div>

            }
            <style type="text/css">{`
                .wishlist .card {
                    border: none;
                    background: ${constants.COLORS.SECONDARY};
                    background: white;
                    margin-bottom: 1.5%;
                }
                .wishlist .img {
                    width: 100%;
                }
                .wishlist ._padding {
                    display: flex;
                    align-items: center;
                    justify-content: center
                    margin: 0%;
                    font-size: 13px;
                    color: white;
                }
                .wishlist .card-header {
                    display: inline-flex;
                    align-items: center;
                    font-size: 15px;
                    font-weight: bold;
                    color: ${consts.COLORS.TEXT};
                    border: none;
                    padding-bottom: 0%;
                    background: none;
                }
                .wishlist .heading {
                    font-size: 18px;
                    padding-top: 10px;
                    width: 100%;
                    text-align:center;
                }
                
                .wishlist .form_label {
                    font-size: 11px;
                    color: ${consts.COLORS.TEXT};
                }
                .wishlist .form_control:disabled {
                    background: none;
                    color: ${consts.COLORS.TEXT};
                    border: none;
                    padding-left: 0%;
                    padding-top: 0%;
                    font-size: 14px;
                    font-weight: bold;
                }
                .delete {
                    cursor: pointer;
                }
                @media (max-width: 1199px){
                    .wishlist .order_col {
                        padding-left: 0.5%;
                        padding-right: 0.5%;
                    }
                }
                @media (max-width: 767px){
                    .wishlist {
                        padding: 1.5%;
                    }
                    .wishlist .order_col {
                        padding: 0%;
                        margin: 0%;
                    }
                    .wishlist .card-body {
                        padding: 2%;
                    }
                }
            `}</style>
        </div >
    )
}