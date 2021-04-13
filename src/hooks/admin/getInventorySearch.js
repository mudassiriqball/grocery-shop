import { useEffect, useState } from 'react';
import axios from 'axios';
import urls from '../../utils/urls/index';

export default function getInventorySearch(refresh_count, fieldName, query, queryPageNumber, limit) {
    const [INVENTORY_SEARCH_LOADING, setLoading] = useState(false);
    const [INVENTORY_SEARCH_ERROR, setError] = useState(false);
    const [INVENTORY_SEARCH_PRODUCTS, setProducts] = useState([]);
    const [INVENTRY_SEARCH_PAGES, setPages] = useState(0);
    useEffect(() => {
        setProducts([]);
        return () => {
        }
    }, [refresh_count, fieldName, query])

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            if (query !== '' && fieldName !== '') {
                setLoading(true);
                setError(false);
                axios({
                    method: 'GET',
                    url: urls.GET_REQUEST.INVENTRY_SEARCH,
                    params: {
                        field: fieldName, q: query, page: queryPageNumber, limit: limit,
                    },
                    cancelToken: source.token,
                }).then(res => {
                    setLoading(false);
                    setProducts(prevPro => {
                        return [...new Set([...prevPro, ...res.data.data.docs])]
                    });
                    setPages(res.data.data.pages);
                }).catch(err => {
                    console.log('Get products by search:', err);
                    setLoading(false)
                    setError(true)
                    if (axios.isCancel(err)) return
                })
            }
        }
        getData();
        return () => {
            source.cancel();
            getData;
        };
    }, [queryPageNumber, refresh_count, query, fieldName]);
    return {
        INVENTORY_SEARCH_LOADING,
        INVENTORY_SEARCH_ERROR,
        INVENTORY_SEARCH_PRODUCTS,
        INVENTRY_SEARCH_PAGES
    }
}