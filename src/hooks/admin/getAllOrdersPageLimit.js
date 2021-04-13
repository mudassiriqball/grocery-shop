import { useEffect, useState } from 'react'
import axios from 'axios'
import urls from '../../utils/urls/index'

export default function getAllOrdersPageLimit(token, refresh, status, pageNumber, limit) {
    const [ALL_ORDERS_PAGE_LIMIT_LOADING, setLoading] = useState(false)
    const [ALL_ORDERS_PAGE_LIMIT_ERROR, setError] = useState('')
    const [ALL_ORDERS_PAGE_LIMIT_ORDERS, setOrders] = useState([])
    const [ALL_ORDERS_PAGE_LIMIT_PAGES, setPages] = useState(0)
    const [ALL_ORDERS_PAGE_LIMIT_TOTAL, setTotal] = useState(0)

    useEffect(() => {
        setOrders([])
    }, [refresh])

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            setLoading(true)
            setError(false)
            let cancle
            axios({
                method: 'GET',
                url: urls.GET_REQUEST.ALL_ORDERS_PAGE_LIMIT_BY_STATUS + status,
                headers: {
                    'authorization': token
                },
                params: { page: pageNumber, limit: limit },
                cancelToken: new axios.CancelToken(c => cancle = c)
            }).then(res => {
                if (unmounted) {
                    setLoading(false)
                    setOrders(prevOrder => {
                        return [...new Set([...prevOrder, ...res.data.data.docs])]
                    })
                    setPages(res.data.data.pages)
                    setTotal(res.data.data.total)
                }
            }).catch(err => {
                if (unmounted) {
                    setLoading(false)
                    if (axios.isCancel(err)) return
                    setError(true)
                }
            })
        }
        getData()
        return () => {
            unmounted = false
            source.cancel();
        };
    }, [status, pageNumber, refresh])

    return {
        ALL_ORDERS_PAGE_LIMIT_LOADING,
        ALL_ORDERS_PAGE_LIMIT_ERROR,
        ALL_ORDERS_PAGE_LIMIT_ORDERS,
        ALL_ORDERS_PAGE_LIMIT_PAGES,
        ALL_ORDERS_PAGE_LIMIT_TOTAL
    }
}