import { useEffect, useState } from 'react';
import axios from 'axios';
import urls from '../../utils/urls/index';

export default function getSearchProducts(query) {
    const [SEARCH_PRODUCTS_LOADING, setLoading] = useState(false);
    const [SEARCH_PRODUCTS_ERROR, setError] = useState('');
    const [SEARCH_PRODUCTS, setProducts] = useState([]);

    useEffect(() => {
        setProducts([]);
    }, [query]);

    useEffect(() => {
        let unmounted = true
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const getData = () => {
            if (query !== '') {
                setLoading(true);
                setError(false);
                axios({
                    method: 'GET',
                    url: urls.GET_REQUEST.SEARCH_PRODUCTS,
                    params: {
                        q: query
                    },
                    cancelToken: source.token
                }).then(res => {
                    if (unmounted) {
                        setLoading(false);
                        setProducts(prevPro => {
                            return [...new Set([...prevPro, ...res.data.data.docs])]
                        });
                    }
                }).catch(err => {
                    console.log('Get products by search:', err);
                    setLoading(false)
                    if (unmounted) {
                        if (axios.isCancel(err)) return
                        setError(true)
                    }
                })
            }
        }
        getData()
        return () => {
            unmounted = false
            source.cancel();
        };
    }, [query]);

    return {
        SEARCH_PRODUCTS_LOADING,
        SEARCH_PRODUCTS_ERROR,
        SEARCH_PRODUCTS
    }
}