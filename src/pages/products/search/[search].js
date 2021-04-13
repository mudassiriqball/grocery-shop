import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useRouter } from 'next/router';
import axios from 'axios';
import Loading from '../../../components/loading';
import NoDataFound from '../../../components/no-data-found';
import ProductCard from '../../../components/customer/product-card';
import { getDecodedTokenFromStorage, getTokenFromStorage } from '../../../utils/services/auth';
import urls from '../../../utils/urls';
import Layout from '../../../components/customer/Layout';
import getSearchProducts from '../../../hooks/customer/getSearchProducts';
import StickyBottomNavbar from '../../../components/customer/sticky-bottom-navbar';

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

export default function Category(props) {
    const router = useRouter();
    const { search } = router.query;
    // User
    const [user, setUser] = useState({ _id: '', fullName: '', mobile: '', city: '',  address: '', email: '', status: '', role: '', wishList: '', cart: '', entry_date: '' })
    const [token, setToken] = useState('');
    useEffect(() => {
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
    const getUser = async (id) => {
        await axios.get(urls.GET_REQUEST.USER_BY_ID + id).then((res) => {
            setUser(res.data.data[0]);
        }).catch((err) => {
            console.log('Get user err in profile', err);
        })
    }
    // End of User

    // Search Hook
    const { SEARCH_PRODUCTS_LOADING, SEARCH_PRODUCTS_ERROR, SEARCH_PRODUCTS } = getSearchProducts(search);
    // End of Search Hook

    return (
        <div className='w-100 h-100'>
            <Layout
                user={user}
                categories_list={props.categories_list}
                sub_categories_list={props.sub_categories_list}
            />
            <div className='_category'>
                {SEARCH_PRODUCTS && SEARCH_PRODUCTS.length > 0 ?
                    <Row noGutters className='p-0 m-0'>
                        {SEARCH_PRODUCTS && SEARCH_PRODUCTS.map((element, index) => (
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
                    !SEARCH_PRODUCTS_LOADING && <NoDataFound />
                }
                {SEARCH_PRODUCTS_LOADING && <Loading />}
            </div>
            <StickyBottomNavbar user={user} />
            <style type="text/css">{`
                @media only screen and (max-width: 600px) {
                    ._category {
                        padding: 2% 5%;
                    }
                }
                @media only screen and (min-width: 600px) {
                    ._category {
                        padding: 2% 5%;
                    }
                }
                @media only screen and (min-width: 768px) {
                    ._category {
                        padding: 2% 7%;
                    }
                }
                @media only screen and (min-width: 992px) {
                    ._category {
                        padding: 2% 9%;
                    }
                }
                @media only screen and (min-width: 1200px) {
                    ._category {
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
