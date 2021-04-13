import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useRouter } from 'next/router';
import axios from 'axios';

import getProductsByCategorySubCategoryPageLimit from '../../../hooks/customer/getProductsByCategorySubCategoryPageLimit';
import { getDecodedTokenFromStorage, getTokenFromStorage } from '../../../utils/services/auth';
import StickyBottomNavbar from '../../../components/customer/sticky-bottom-navbar';
import DetectDeviceView from "../../../hooks/detect-device-view";

import ProductCard from '../../../components/customer/product-card';
import NoDataFound from '../../../components/no-data-found';
import Layout from '../../../components/customer/Layout';
import Loading from '../../../components/loading';
import urls from '../../../utils/urls';

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
    const { isMobile } = DetectDeviceView();
    const router = useRouter();
    const { category, sub_category } = router.query;
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

    // Category
    const [page, setPage] = useState(1);
    const { PRODUCTS_PAGE_LIMIT_LOADING, PRODUCTS_PAGE_LIMIT_ERROR, PRODUCTS_PAGE_LIMIT_PRODUCTS, PRODUCTS_PAGE_LIMIT_HAS_MORE } =
        getProductsByCategorySubCategoryPageLimit(category, sub_category, page, isMobile ? '9' : '12');
    // End of category

    // Use Infinite Scroll
    const observer = useRef();
    const lastProducrRef = useCallback((node) => {
        if (PRODUCTS_PAGE_LIMIT_LOADING) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && PRODUCTS_PAGE_LIMIT_HAS_MORE) {
                setPage(prevPageNumber => prevPageNumber + 1);
            }
        })
        if (node) observer.current.observe(node);
    }, [PRODUCTS_PAGE_LIMIT_LOADING, PRODUCTS_PAGE_LIMIT_HAS_MORE]);
    // End of Use Infinite Scroll

    return (
        <div className='w-100 h-100'>
            <Layout
                user={user}
                categories_list={props.categories_list}
                sub_categories_list={props.sub_categories_list}
            />
            <div className='_subCategory'>
                {PRODUCTS_PAGE_LIMIT_PRODUCTS && PRODUCTS_PAGE_LIMIT_PRODUCTS.length > 0 ?
                    <Row noGutters className='p-0 m-0'>
                        {PRODUCTS_PAGE_LIMIT_PRODUCTS && PRODUCTS_PAGE_LIMIT_PRODUCTS.map((element, index) => (
                            <Col ref={lastProducrRef} lg={3} md={4} sm={12} xs={12} key={index} className='p-0 m-0' >
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
                    !PRODUCTS_PAGE_LIMIT_LOADING && <NoDataFound />
                }
                {PRODUCTS_PAGE_LIMIT_LOADING && <Loading />}
            </div>
            <StickyBottomNavbar user={user} />
            <style type="text/css">{`
                ._subCategory {
                    min-height: 70vh;
                    align-items: center;
                    flex-direction: column;
                    display: flex;
                }
                @media only screen and (max-width: 600px) {
                    ._subCategory {
                        padding: 2% 5%;
                    }
                }
                @media only screen and (min-width: 600px) {
                    ._subCategory {
                        padding: 2% 5%;
                    }
                }
                @media only screen and (min-width: 768px) {
                    ._subCategory {
                        padding: 2% 7%;
                    }
                }
                @media only screen and (min-width: 992px) {
                    ._subCategory {
                        padding: 2% 9%;
                    }
                }
                @media only screen and (min-width: 1200px) {
                    ._subCategory {
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
