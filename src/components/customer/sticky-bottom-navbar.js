import React, { useState, useEffect } from 'react';
import { Navbar, Nav } from 'react-bootstrap'
import consts from '../../constants';
import baseUrl from '../../utils/urls/baseUrl';

import { ImCart } from 'react-icons/im';
import { FaListAlt } from 'react-icons/fa';
import { RiAccountPinCircleFill } from 'react-icons/ri';
import { AiFillHome } from 'react-icons/ai';

const StickyBottomNavbar = (props) => {
    const { user } = props;
    const [isSticky, setSticky] = useState(true);
    const [curentHref, setCurentHref] = useState('')
    let curr = 0

    useEffect(() => {
        curr = window.scrollY
        window.addEventListener('scroll', e => handleScroll(e));

        return () => {
            window.removeEventListener('scroll', e => handleScroll(e));
        };
    }, []);

    const handleScroll = (e) => {
        const window = e.currentTarget;
        if (curr > window.scrollY) {
            setSticky(true)
        } else if (curr < window.scrollY) {
            setSticky(false)
        }
        curr = window.scrollY
    };

    useEffect(() => {
        if (window.location.href === baseUrl + '/' || window.location.href === baseUrl || window.location.href === baseUrl + '/index') {
            setCurentHref('index')
        } else if (window.location.href === baseUrl + '/categories') {
            setCurentHref('categories')
        } else if (window.location.href === baseUrl + '/cart') {
            setCurentHref('cart')
        } else if (window.location.href === baseUrl + '/profile') {
            setCurentHref('profile')
        } else if (window.location.href === baseUrl + '/login') {
            setCurentHref('login')
        }
        return () => {
            setCurentHref('');
        }
    }, [])

    return (
        <div className='stick_bottom_navbar'>
            <div className={`sticky-wrapper${isSticky ? ' sticky' : ''}`}>
                <Navbar bg="white" className='sticky-inner'>
                    <Nav className="d-inline-flex align-items-center w-100" style={{ borderTop: `1px solid ${consts.COLORS.SHADOW}` }}>
                        <div className='mr-auto'></div>
                        <Nav.Link href="/" className='nav_link' style={{ color: curentHref == 'index' ? consts.COLORS.SEC : consts.COLORS.GRAY }} >
                            <AiFillHome style={styles.fontawesome} />
                            {'Home'}
                        </Nav.Link>
                        <div className='mr-auto'></div>
                        <Nav.Link href="/categories" className='nav_link' style={{ color: curentHref === 'categories' ? consts.COLORS.SEC : consts.COLORS.GRAY }}>
                            <FaListAlt style={styles.Categories_fontawesome} />
                            {'Categories'}
                        </Nav.Link>
                        <div className='mr-auto'></div>
                        <Nav.Link href="/cart" className='nav_link' style={{ color: curentHref === 'cart' ? consts.COLORS.SEC : consts.COLORS.GRAY }} >
                            <ImCart style={styles.fontawesome} />
                            {'Cart'}
                        </Nav.Link>
                        <div className='mr-auto'></div>
                        <Nav.Link href={user !== '' && user.fullName !== '' ? '/profile' : '/login'} className='nav_link'
                            style={{ color: curentHref === 'profile' || curentHref === 'login' ? consts.COLORS.SEC : consts.COLORS.GRAY }}
                        >
                            <RiAccountPinCircleFill style={styles.fontawesome} />
                            {'Account'}
                        </Nav.Link>
                    </Nav>
                </Navbar>
            </div>
            <style type="text/css">{`
                .stick_bottom_navbar .sticky-wrapper {
                    position: relative;
                    background: white;
                }
                .sticky-inner{
                    padding: 0%;
                }
               .stick_bottom_navbar .sticky .sticky-inner {
                    background: white;
                    position: fixed;
                    align-items: center;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000000;
                }

                .stick_bottom_navbar .nav_link{
                    padding: 1% 0% 0.2% 0%;
                    margin-right: auto;
                    font-size: 11px;
                    justify-content: center;
                    align-items: center;
                    display: flex;
                    flex-direction: column;
                }
                @media only screen and (min-width: 767px) {
                    .stick_bottom_navbar {
                        display: none;
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

const styles = {
    fontawesome: {
        width: '25px',
        height: '25px',
        maxHeight: '25px',
        maxWidth: '25px',
    },
    Categories_fontawesome: {
        width: '25px',
        height: '25px',
        maxHeight: '25px',
        maxWidth: '25px',
    },
}
export default StickyBottomNavbar