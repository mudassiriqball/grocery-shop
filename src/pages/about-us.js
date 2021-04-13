import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Row } from 'react-bootstrap';
import Footer from '../components/customer/footer';
import StickyBottomNavbar from '../components/customer/sticky-bottom-navbar';
import Toolbar from '../components/customer/toolbar'
import constants from '../constants';
import { checkTokenExpAuth } from '../utils/services/auth';
import urls from '../utils/urls';

export default function AboutUs(props) {
    const [user, setUser] = useState({
        _id: '', fullName: '', mobile: '', city: '',  address: '',
        email: '', status: '', role: '', wishList: '', cart: '', entry_date: ''
    });

    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        async function getData() {
            const _decoded_token = await checkTokenExpAuth()
            if (_decoded_token != null) {
                setUser(_decoded_token);
                await getUser(_decoded_token._id);
            }
        }
        getData()
        return () => {
            source.cancel();
            getData;
        };
    }, []);

    async function getUser(id) {
        await axios.get(urls.GET_REQUEST.USER_BY_ID + id).then((res) => {
            setUser(res.data.data[0]);
        }).catch((err) => {
            console.log('Get user error in TermsAndConditions', err);
        })
    }
    return (
        <div className='main_about_us'>
            <Toolbar user={user} />
            <div className='_about_us'>

            </div>
            <Footer />
            <StickyBottomNavbar user={user} />
            <style type='text/css'>{`
                ._about_us{
                    padding: 2% 15%;
                    min-height: 90vh;
                }
                ._about_us p {
                    color: ${constants.COLORS.TEXT};
                    font-size: 14px;
                    text-align:justify;
                    line-height: 1.8rem;
                }
                ._about_us h5 {
                    color: ${constants.COLORS.TEXT};
                    font-weight: bolder;
                }
                @media (max-width: 1199px){
                    ._about_us{
                        padding: 2% 12%;
                    }
                }
                @media (max-width: 991px){
                    ._about_us{
                        padding: 2% 9%;
                    }
                }
                 @media (max-width: 767px){
                    ._about_us{
                        padding: 2% 7%;
                    }
                }
                 @media (max-width: 575px){
                    ._about_us{
                        padding: 2% 5%;
                    }
                }
            `}</style>
            <style jsx>{`
                .main_about_us {
                    min-height: 100vh;
                    background: ${constants.COLORS.WHITE};
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                }
            `}</style>
            <style jsx global>{`
                * {
                    font-family: Oswald,sans-serif;
                }
            `}</style>
        </div >
    )
}

