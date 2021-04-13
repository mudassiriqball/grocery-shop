import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, Form, Col, Row, Image, InputGroup, Button, Spinner } from 'react-bootstrap'
import constants from '../../constants';
import urls from '../../utils/urls';
import CustomButton from '../CustomButton';
import renderError from '../renderError';

export default function Address(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [isEditProfile, setisEditProfile] = useState(false)

    const [city, setCity] = useState(props.city);
    const [cityErr, setcityErr] = useState('');
    const [address, setAddress] = useState(props.address);
    const [addressErr, setaddressErr] = useState('');

    useEffect(() => {
        setCity(props.city)
        setAddress(props.address)
        return () => {

        }
    }, [props])

    function handleUpdateProfile() {
        if (city === '' || city.length < 3 || city.length > 25 || address === '' || address.length < 5 || address.length > 150) {
            if (city === '' || city.length < 3 || city.length > 25) {
                setcityErr('Value must be 3-25 characters');
            }
            if (address === '' || address.length < 5 || address.length > 150) {
                setaddressErr('Value must be 5-150 characters');
            }
        } else {
            setIsLoading(true)
            let data = {}
            data = {
                city: city,
                address: address,
            }
            axios.put(urls.PUT_REQUEST.UPDATE_USER_PROFILE + props._id, data, {
                headers: {
                    'authorization': props.token,
                }
            }).then((response) => {
                setisEditProfile(false)
                setIsLoading(false)
                props.showAlert('Address Updated Successfully')
                props.reloadUser()
            }).catch((error) => {
                setIsLoading(false)
                console.log('Address Update Failed:', error)
                alert('Address Update Failed')
            });
        }
    }

    function handleCancelEdit() {
        setaddressErr('');
        setcityErr('');
        setisEditProfile(!isEditProfile)
        setAddress(props.address)
        setCity(props.city)
    }

    return (
        <div className='address'>
            {!props.isMobile && <label className='heading'>{'My Address'}</label>}
            <Card>
                <Card.Body className='card_body'>
                    <Row className='p-0 m-0'>
                        <Form.Group as={Col} lg={6} md={6} sm={6} xs={12} className='address_col'>
                            <Form.Label className='form_label'>{'City'}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    className='form_control'
                                    type='text'
                                    value={city}
                                    onChange={(e) => { setCity(e.target.value), setcityErr('') }}
                                    style={{ color: isEditProfile ? constants.COLORS.TEXT : constants.COLORS.MUTED }}
                                    disabled={!isEditProfile}
                                    isInvalid={isEditProfile && cityErr}
                                />
                                {isEditProfile && cityErr !== '' && renderError(cityErr)}
                            </InputGroup>
                        </Form.Group>
                    </Row>

                    <Row className='p-0 m-0'>
                        <Form.Group as={Col} lg={12} md={12} sm={12} xs={12} className='address_col'>
                            <Form.Label className='form_label'>{props.role == 'vendor' && 'Shop '}{'Address'}</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    className='form_control'
                                    type='text'
                                    value={address}
                                    onChange={(e) => { setAddress(e.target.value), setaddressErr('') }}
                                    style={{ color: isEditProfile ? constants.COLORS.TEXT : constants.COLORS.MUTED }}
                                    disabled={!isEditProfile}
                                    isInvalid={isEditProfile && addressErr}
                                />
                                {isEditProfile && addressErr !== '' && renderError(addressErr)}
                            </InputGroup>
                        </Form.Group>
                    </Row>
                    <Form.Group as={Row} className='ml-0 mr-0 mb-0 mt-5 p-0'>
                        <Col lg="auto" md="auto" sm="auto" xs="auto" className='address_col'>
                            <CustomButton
                                title={isEditProfile ? 'Cancel' : 'Edit Address'}
                                onClick={handleCancelEdit}
                            >
                            </CustomButton>
                        </Col>
                        <Col></Col>
                        <Col lg="auto" md="auto" sm="auto" xs="auto" className='my_profile_col'>
                            {isEditProfile &&
                                <CustomButton
                                    loading={isLoading}
                                    disabled={city == props.city && address == props.address}
                                    title={isLoading ? 'Updating' : 'Update'}
                                    onClick={handleUpdateProfile}
                                >
                                </CustomButton>
                            }
                        </Col>
                    </Form.Group>
                </Card.Body>
            </Card>
            <style type="text/css">{`
                .address .card {
                    background: ${constants.COLORS.SECONDARY};
                    min-height: 200px;
                }
                .address .card-header {
                    display: inline-flex;
                    align-items: center;
                    font-size: 15px;
                    font-weight: bold;
                    color: ${constants.COLORS.TEXT};
                    border: none;
                    padding-bottom: 0%;
                    background: none;
                }
                .address .heading {
                    font-size: 18px;
                    padding-top: 10px;
                    width: 100%;
                    text-align:center;
                }
                .address .form_label {
                    font-size: 13px;
                    color: ${constants.COLORS.TEXT};
                }
                .address .form_control:disabled {
                    background: none;
                    color: white;
                }
                @media (max-width: 1199px){
                    .address .address_col  {
                        padding-left: 0.5%;
                        padding-right: 0.5%;
                    }
                }
                @media (max-width: 767px){
                    .address {
                        padding: 1.5%;
                    }
                    .address .address_col {
                        padding: 0%;
                    }
                    .address .card_body {
                        padding: ${isEditProfile ? '3%' : 'auto'};
                    }
                }
            `}</style>
        </div >
    )
}
