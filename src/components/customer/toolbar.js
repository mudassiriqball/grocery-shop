import React, { useState, useEffect } from 'react'
import { Button, Card, Dropdown, Form, InputGroup, Nav, Navbar } from 'react-bootstrap'
import consts from '../../constants'
import PhoneInput from 'react-phone-input-2'
import renderError from '../renderError'
import globalStyle from '../../utils/styles/globalStyle';
import Link from 'next/link'
import urls from '../../utils/urls'
import { saveTokenToStorage, removeTokenFromStorage } from '../../utils/services/auth'
import axios from 'axios';
import CustomButton from '../CustomButton'
import jwt_decode from 'jwt-decode';
import Router from 'next/router';

import { BiLogInCircle, BiLogOutCircle } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { RiDashboardFill } from 'react-icons/ri';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

export default function Toolbar(props) {
    const { user } = props;
    const [showDropdown, setShowDropdown] = useState(false);
    const [passwordError, setpasswordError] = useState('');
    const [loading, setLoading] = useState(false);
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setshowPass] = useState(false);
    const [mobileError, setmobileError] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        return () => {
            setLoading(false);
        }
    }, [])

    // Login/Signup
    const handleLogin = async () => {
        if (mobile == '' || password == '') {
            if (mobile == '')
                setmobileError('Required *');
            else
                setmobileError('');

            if (password == '')
                setpasswordError('Required *');
            else
                setpasswordError('');
        } else {
            setLoading(true);
            let data = {};
            data = {
                mobile: '+' + mobile,
                password: password
            };
            await axios.post(urls.POST_REQUEST.LOGIN, data).then(async function (res) {
                await saveTokenToStorage(res.data.token);
                const decodedToken = jwt_decode(res.data.token);
                if (decodedToken.data.role === 'customer') {
                    Router.push('/');
                    Router.reload('/');
                } else if (decodedToken.data.role === 'admin') {
                    Router.push('/admin')
                } else if (decodedToken.data.role == 'ministory') {
                    Router.push('/ministory')
                } else {
                    Router.reload('/');
                }
            }).catch(function (err) {
                setLoading(false);
                setError('Incorrect mobile or password!')
                console.log('Login error:', err);
            });
        }
    }
    const handleEnterKeyPress = (e) => {
        if (e.keyCode == 13 || e.which == 13) {
            handleLogin();
        }
    }
    // End Of Login/Signup


    // Acccount
    const logoutUser = async () => {
        const loggedOut = await removeTokenFromStorage();
        if (loggedOut) {
            Router.replace('/');
            Router.reload('/');
        }
    }
    // End Of Acccount

    return (
        <div className='toolbar'>
            <Navbar collapseOnSelect expand="md" style={{ background: consts.COLORS.SEC, padding: '0.45% 6%', width: '100vw', minWidth: '100%', width: '100%' }} variant='dark'>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" style={{ marginTop: '10px', marginBottom: '10px', marginRight: 'auto' }} />
                <Navbar.Collapse id="responsive-navbar-nav ">
                    <Nav className="mr-auto">
                        <Nav.Link href='/' style={{ fontWeight: 'bold', fontSize: '15px' }} active>GROCERYSHOP@GMAIL.COM</Nav.Link>
                        <Nav.Link style={{ fontWeight: 'bold', fontSize: '15px' }} active>+92 310 1234567</Nav.Link>
                    </Nav>
                    {/* Login/Signup */}
                    {user && user.fullName === '' &&
                        <Nav className="ml-auto">
                            <Dropdown show={showDropdown}
                                flip={"true"}
                                onMouseEnter={() => setShowDropdown(true)}
                                onMouseLeave={() => setShowDropdown(false)}>
                                <Dropdown.Toggle as={Nav.Link} style={{ fontSize: '15px' }} >
                                    {'Login / Signup'}
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ width: '18rem', }} className='dropdown-menu dropdown-menu-right' >
                                    <div style={{ width: '18rem', marginTop: '10px', marginBottom: '10px', textAlign: 'center', color: consts.COLORS.MUTED }}>
                                        {'Don\'t have account ? '}
                                        <span className='signupSpan'><Link onClick={() => setShowDropdown(false)} href='/signup'>{'Signup'}</Link></span>
                                    </div>
                                    <Card style={{ border: 'none' }}>
                                        <Card.Body>
                                            <Card.Title style={{ color: consts.COLORS.MAIN, textAlign: 'center', marginBottom: '20px' }}>Signin</Card.Title>
                                            <Form>
                                                <Form.Group controlId="formBasicEmail">
                                                    <PhoneInput
                                                        inputStyle={{ width: '100%' }}
                                                        country={'us'}
                                                        onlyCountries={['us', 'pk']}
                                                        value={mobile}
                                                        searchPlaceholder={'310 1234567'}
                                                        onChange={phone => { setMobile(phone), setmobileError(''), setError('') }}
                                                        onKeyPress={(e) => handleEnterKeyPress(e)}
                                                    />
                                                    {mobileError !== '' && renderError(mobileError)}
                                                </Form.Group>
                                                <Form.Group controlId="formBasicPassword">
                                                    <InputGroup>
                                                        <Form.Control
                                                            type={showPass ? 'text' : "password"}
                                                            value={password}
                                                            onChange={(e) => { setPassword(e.target.value), setpasswordError(''), setError('') }}
                                                            placeholder="Password"
                                                            onKeyPress={(e) => handleEnterKeyPress(e)}
                                                        />
                                                        <InputGroup.Append>
                                                            {showPass ?
                                                                <Button variant='light' onClick={() => setshowPass(false)}>
                                                                    <AiOutlineEyeInvisible style={{ fontSize: '20px' }} />
                                                                </Button>
                                                                :
                                                                <Button variant='light' onClick={() => setshowPass(true)}>
                                                                    <AiOutlineEye style={{ fontSize: '20px' }} />
                                                                </Button>
                                                            }
                                                        </InputGroup.Append>
                                                    </InputGroup>
                                                    {passwordError !== '' && renderError(passwordError)}
                                                </Form.Group>

                                                {error !== '' && renderError(error)}
                                                <CustomButton
                                                    block
                                                    loading={loading}
                                                    disabled={loading}
                                                    title={'Login'}
                                                    onClick={() => handleLogin()}
                                                >
                                                    {!loading && <BiLogInCircle style={globalStyle.leftIcon} />}
                                                </CustomButton>
                                            </Form>
                                            <a href="/forgot-password" className='color w-100' style={{ fontSize: 'small', marginTop: '50px' }}>Forgot Password ?</a>
                                        </Card.Body>
                                    </Card>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    }

                    {/* Account */}
                    {user && user.fullName !== '' &&
                        <Nav className="justify-content-center ml-auto">
                            <Dropdown show={showDropdown}
                                flip={"true"}
                                onMouseEnter={() => setShowDropdown(true)}
                                onMouseLeave={() => setShowDropdown(false)}>
                                <Dropdown.Toggle as={Nav.Link}
                                    style={{ fontWeight: 'bold', fontSize: '15px' }} active
                                >
                                    {user.fullName}
                                </Dropdown.Toggle>
                                <Dropdown.Menu className='dropdown-menu dropdown-menu-right' style={{ border: 'none', paddingTop: '7px', background: 'none' }} >
                                    <Card style={{ boxShadow: `1px 0px 3px lightgray` }}>
                                        <div className='link_div'>
                                            <Nav.Link href="/profile" onClick={() => setShowDropdown(false)} style={{ fontWeight: 'bolder', padding: '10px', color: consts.COLORS.SEC, fontSize: '12px', flexDirection: "row", alignItems: 'center' }}>
                                                <CgProfile style={{ color: consts.COLORS.SEC, fontSize: '20px', marginRight: '10px' }} />
                                                {'PROFILE'}
                                            </Nav.Link>
                                        </div>
                                        {user.role == 'admin' &&
                                            <div className='link_div'>
                                                <Nav.Link href="/admin" onClick={() => setShowDropdown(false)} style={{ fontWeight: 'bolder', padding: '10px', color: consts.COLORS.SEC, fontSize: '12px', flexDirection: "row", alignItems: 'center' }}>
                                                    <RiDashboardFill style={{ color: consts.COLORS.SEC, fontSize: '20px', marginRight: '10px' }} />
                                                    {'DASHBOARD'}
                                                </Nav.Link>
                                            </div>
                                        }
                                        {user.role == 'ministory' &&
                                            <div className='link_div'>
                                                <Nav.Link href="/admin" onClick={() => setShowDropdown(false)} style={{ fontWeight: 'bolder', padding: '10px', color: consts.COLORS.SEC, fontSize: '12px', flexDirection: "row", alignItems: 'center' }}>
                                                    <RiDashboardFill style={{ color: consts.COLORS.SEC, fontSize: '20px', marginRight: '10px' }} />
                                                    {'DASHBOARD'}
                                                </Nav.Link>
                                            </div>
                                        }
                                        <div className='link_div'>
                                            <Nav.Link href="#" onClick={() => logoutUser()} style={{ fontWeight: 'bolder', padding: '10px', color: consts.COLORS.SEC, fontSize: '12px', flexDirection: "row", alignItems: 'center' }}>
                                                <BiLogOutCircle style={{ color: consts.COLORS.SEC, fontSize: '20px', marginRight: '10px' }} />
                                                {'LOGOUT'}
                                            </Nav.Link>
                                        </div>
                                    </Card>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    }
                </Navbar.Collapse>
            </Navbar>
            <style jsx>{`
                .toolbar {
                    width: 100%;
                }
                .toolbar .signupSpan {
                    cursor: pointer;
                }
                .toolbar .signupSpan:hover {
                    cursor: pointer;
                }
                .toolbar .cart {
                    width: 60px;
                    height: 60px;
                    margin-left: 5%;
                    background: ${consts.COLORS.MAIN};
                }
                .toolbar .cart:hover {
                    background: ${consts.COLORS.SEC};
                }
                .toolbar .link_div {
                    color: ${consts.COLORS.SEC};
                }
                .toolbar .link_div:hover {
                    background: ${consts.COLORS.MAIN};
                    color: ${consts.COLORS.WHITE};
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
