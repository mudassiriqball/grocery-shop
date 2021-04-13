import React, { useEffect, useState } from 'react';
import axios from 'axios';
import urls from '../../utils/urls';

export default function getCustomersOrdersPageLimit(_id, token, status, page, limit) {
    const [CUSTOMER_ORDERS_LOADING, setLoading] = useState(false);
    const [CUSTOMER_ORDERS_HASMORE, setHasMore] = useState(false);
    const [CUSTOMER_ORDERS, setOrders] = useState([]);

    useEffect(() => {
        setOrders([]);
        return () => {
        }
    }, [status, _id])

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            if (token != null) {
                setLoading(true)
                axios({
                    method: 'GET',
                    url: urls.GET_REQUEST.CUSTOMERS_ORDERS_BY_STATUS + _id,
                    headers: {
                        'authorization': token
                    },
                    params: { page: page, limit: limit, status: status },
                    cancelToken: source.token
                }).then(res => {
                    setLoading(false);
                    setHasMore(res.data.data.docs && res.data.data.docs.length > 0);
                    setOrders(prevOrders => {
                        return [...new Set([...prevOrders, ...res.data.data.docs])]
                    })
                }).catch(err => {
                    setLoading(false)
                    if (axios.isCancel(err)) return
                    console.log('Get getCustomersOrdersPageLimit Error:', err);
                })
            }
        }
        getData();
        return () => {
            getData;
            source.cancel();
        };
    }, [page, limit, status]);

    return {
        CUSTOMER_ORDERS_LOADING,
        CUSTOMER_ORDERS_HASMORE,
        CUSTOMER_ORDERS
    }
}