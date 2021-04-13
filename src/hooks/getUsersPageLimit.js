import { useEffect, useState } from 'react';
import axios from 'axios';
import urls from '../utils/urls/index';
export default function getUsersPageLimit(token, refresh, role, status, pageNumber, limit) {
    const [USERS_PAGE_LOADING, setLoading] = useState(false)
    const [USERS_PAGE_ERROR, setError] = useState('')
    const [USERS_PAGE_USERS, setUsers] = useState([])
    const [USERS_PAGE_PAGES, setPages] = useState(0)
    const [USERS_PAGE_TOTAL, setTotal] = useState(0)

    useEffect(() => {
        setUsers([])
    }, [refresh])

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        const getData = () => {
            if (token != null && status !== '') {
                setLoading(true)
                setError(false)
                axios({
                    method: 'GET',
                    url: urls.GET_REQUEST.USERS_BY_STATUS + role,
                    headers: {
                        'authorization': token
                    },
                    params: { page: pageNumber, limit: limit, status: status },
                    cancelToken: source.token
                }).then(res => {
                    setLoading(false)
                    setUsers(prevPro => {
                        return [...new Set([...prevPro, ...res.data.data.docs])]
                    })
                    setPages(res.data.data.pages)
                    setTotal(res.data.data.total)
                }).catch(err => {
                    setLoading(false)
                    setError(true)
                    if (axios.isCancel(err)) return
                    console.log('Get User By page limit Error:', err);
                })
            }
        }
        getData()
        return () => {
            source.cancel();
            getData;
        };
    }, [status, pageNumber, refresh, token])

    return {
        USERS_PAGE_LOADING,
        USERS_PAGE_ERROR,
        USERS_PAGE_USERS,
        USERS_PAGE_PAGES,
        USERS_PAGE_TOTAL
    }
}