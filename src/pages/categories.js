import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap'
import axios from 'axios'
import Router from 'next/router'
import Footer from '../components/customer/footer'
import StickyBottomNavbar from '../components/customer/sticky-bottom-navbar';
import Toolbar from '../components/customer/toolbar';
import consts from '../constants';
import urls from '../utils/urls';
import { getDecodedTokenFromStorage, getTokenFromStorage } from '../utils/services/auth';

export async function getServerSideProps(context) {
    let categories_list = []
    let sub_categories_list = []

    await axios.get(urls.GET_REQUEST.CATEGORIES).then((response) => {
        categories_list = response.data.category.docs;
        sub_categories_list = response.data.sub_category.docs;
    }).catch((error) => {
        console.log('Caterories Fetchig Error: ', error)
    })
    return {
        props: {
            categories_list,
            sub_categories_list
        },
    }
}

function Categories({ categories_list, sub_categories_list }) {
    const [user, setUser] = useState({ _id: '', fullName: '', mobile: '', city: '', licenseNo: '', address: '', email: '', status: '', role: '', wishList: '', cart: '', entry_date: '' })
    const [token, setToken] = useState('');
    useEffect(() => {
        const getDecodedToken = async () => {
            const decodedToken = await getDecodedTokenFromStorage();
            if (decodedToken !== null) {
                setUser(decodedToken);
                getUser(decodedToken._id);
                const _token = await getTokenFromStorage();
                if (_token !== null)
                    setToken(_token);
            }
        }
        getDecodedToken();
        return () => { }
    }, []);

    async function getUser(id) {
        await axios.get(urls.GET_REQUEST.USER_BY_ID + id).then((res) => {
            setUser(res.data.data[0]);
        }).catch((err) => {
            console.log('Get user error in profile', err);
        })
    }

    return (
        <div className='categories'>
            <Toolbar title={'Categories'} />
            <Row className='_row'>
                {categories_list && categories_list.map((element, index) =>
                    <Col key={index} className='col' lg={4} md={4} sm={12} xs={12}>
                        <div>
                            <label className='category' onClick={() => Router.push('/products/[category]', `/products/${element._id}`)}>{element.value}</label>
                        </div>
                        <hr className='hr' />
                        {sub_categories_list && sub_categories_list.map((e, i) =>
                            element._id == e.category_id ?
                                <div key={i}>
                                    <label className='sub-category' onClick={() => Router.push('/products/[category]/[sub_category]', `/products/${element._id}/${e._id}`)}>{e.value}</label>
                                </div>
                                :
                                null
                        )}
                    </Col>
                )}
            </Row>
            <div className='footer'>
                <Footer />
            </div>
            <StickyBottomNavbar user={user} />
            <style type="text/css">{`
                .categories{
                    min-height: 100vh;
                    background: ${consts.COLORS.SECONDARY};
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                }
                .categories ._row{
                    margin: 2% 3.7%;
                    padding: 0%;
                    background: white;
                }
                .categories .col{
                    padding: 2%;
                    display: flex;
                    flex-direction: column;
                }
                .categories .hr{
                    margin: 0% 0% 1% 0%;
                    padding: 1% 0% 0% 0%;
                }

                .categories .category{
                    color: blue;
                }
                .categories .category:hover{
                    cursor: pointer;
                    color: ${consts.COLORS.MAIN};
                    text-decoration: underline;
                }

                .categories .sub-category{
                    font-size: 13px;
                    padding: 1% 0%;
                    color: #808080;
                }
               .categories  .sub-category:hover{
                    cursor: pointer;
                    color: ${consts.COLORS.MAIN};
                    text-decoration: underline;
                }
                
                .categories .footer{
                    display: block;
                }
                .categories .sticy-bottom-navbar{
                    display: none;
                }

                @media (max-width: 767px){
                    .categories .sticy-bottom-navbar{
                        display: block;
                    }
                    .categories .footer{
                        display: none;
                    }
                    .categories ._row{
                        margin: 2% 2% 50px 2%;
                    }
                }
                @media (max-width: 575px){
                    .categories ._row{
                        margin: 1.5% 1.5% 50px 1.5%;
                    }
                }
            `}</style>
            <style jsx global>{`
                html,
                body {
                    padding: 0;
                    margin: 0;
                    font-family: Roboto, Helvetica Neue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;
                }
            `}</style>
        </div>
    )
}

export default Categories