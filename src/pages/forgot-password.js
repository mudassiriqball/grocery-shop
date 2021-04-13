import React, { Component } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import firebase from '../utils/services/firebase'
import { Form, Col, Row, InputGroup, Button, Image, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import AlertModal from '../components/alert-modal';

import { checkAuth, removeTokenFromStorage } from '../utils/services/auth'
import CustomButton from '../components/CustomButton';
import constants from '../constants';
import CustomFormControl from '../components/custom-form-control';
import urls from '../utils/urls';
import PhoneInput from 'react-phone-input-2'
import renderError from '../components/renderError'

const schema = yup.object({
    mobile: yup.string().required("Enter Mobile Number"),
    verification_code: yup.string(),
    password: yup.string().required("Enter Password")
        .min(8, "Password must have at least 8 characters")
        .max(20, "Can't be longer than 20 characters"),
    confirm_password: yup.string().required("Enter Confirm Password").when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf(
            [yup.ref("password")],
            "Passwords must match"
        )
    }),
});

class ForgotPassword extends Component {
    state = {
        hide: true,
        isLoading: false,
        sendCodeLoading: false,
        showToast: false,
        serverErrorMsg: '',
        isCodeSended: false,
        isCodeVerified: false,

        _id: '',
        mobileError: '',
        verificationCodeError: '',
        feedback: '',
        intervalTime: 60,
    };

    async componentDidMount() {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container",
            {
                size: "invisible"
            });
    }

    async handleSenVerificationCode(phoneNumber) {
        console.log('mobile:', phoneNumber);
        if (phoneNumber === '') {
            this.setState({ mobileError: 'Required *' })
        } else {
            const currentComponent = this
            this.setState({ sendCodeLoading: true, mobileError: '' })
            await axios.get(urls.GET_REQUEST.VARIFY_MOBILE_NUMBER + phoneNumber)
                .then(function (res) {
                    if (res.data.code == 201) {
                        currentComponent.setState({
                            intervalTime: 60,
                            isResendCode: false,
                            feedback: '',
                            _id: res.data._id,
                            sendCodeLoading: false,
                        });

                        // Send code to number
                        var appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
                        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
                            .then(function (confirmationResult) {
                                window.confirmationResult = confirmationResult;
                                console.log()
                                currentComponent.setState({
                                    isCodeSended: true,
                                    mobileError: '',
                                    feedback: 'Code Sended',
                                    sendCodeLoading: false,
                                })
                                let interval = null
                                interval = setInterval(() => {
                                    currentComponent.setState({ intervalTime: currentComponent.state.intervalTime - 1 });
                                    if (currentComponent.state.intervalTime == 0) {
                                        currentComponent.setState({ isResendCode: true });
                                        clearInterval(interval)
                                    }
                                }, 1000)
                            }).catch(function (error) {
                                if (error.code == 'auth/too-many-requests') {
                                    currentComponent.setState({
                                        isCodeSended: false,
                                        mobileError: 'To Many Request, Please try later',
                                        feedback: '',
                                        isCodeVerified: false,
                                    })
                                } else {
                                    currentComponent.setState({
                                        isCodeSended: false,
                                        mobileError: 'Code not Seded, Check your Number',
                                        feedback: '',
                                        isCodeVerified: false,
                                    })
                                }
                                console.log('send code error:', error)
                            });
                    } else {
                        currentComponent.setState({
                            mobileError: 'Number does not exists!',
                            feedback: '',
                            isCodeSended: false,
                            isCodeVerified: false,
                            sendCodeLoading: false,
                        })
                    }
                }).catch(function (err) {
                    console.log('err:', err)
                    currentComponent.setState({
                        mobileError: 'Somethig went wront, try again',
                        sendCodeLoading: false,
                    })
                })
        }
    }

    handleVerifyVarificationCode = (code) => {
        const currentComponent = this
        this.setState({ verificationCodeError: '' })
        confirmationResult.confirm(code).then(function (result) {
            currentComponent.setState({
                isCodeVerified: true,
                feedback: 'Number verified',
                verificationCodeError: '',
                isResendCode: false,
            })
        }).catch(function (error) {
            currentComponent.setState({
                verificationCodeError: 'Invalid code',
                feedback: '',
            })
        });
    }

    showPassword = ev => {
        this.setState({ hide: !this.state.hide })
    }

    async resetPassword(values, currentComponent) {
        let data = {}
        data = {
            mobile: values.mobile,
            password: values.password
        }

        if (this.state.isCodeVerified && this.state.isCodeSended) {
            await axios.put(urls.PUT_REQUEST.RESET_PASSWORD + this.state._id, data).then(function (res) {
                removeTokenFromStorage();
                currentComponent.setState({
                    isLoading: false,
                    showToast: true,
                    isCodeSended: false,
                    isCodeVerified: false,
                    isResendCode: false,
                });
                return true;
            }).catch(function (error) {
                currentComponent.setState({ isLoading: false });
                currentComponent.setState({ serverErrorMsg: error.res.data.message })
                return false;
            })
        } else {
            alert('Please first varify your mobile number!')
        }
    }

    render() {
        const { hide } = this.state;
        let eyeBtn;
        if (this.state.hide) {
            eyeBtn = <FontAwesomeIcon icon={faEye} style={styles.fontawesome} />;
        } else {
            eyeBtn = <FontAwesomeIcon icon={faEyeSlash} style={styles.fontawesome} />;
        }

        return (
            <Formik
                validationSchema={schema}
                initialValues={{
                    mobile: '', verification_code: '', password: '', confirm_password: '',
                }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    this.setState({ isLoading: true });
                    setSubmitting(true);
                    setTimeout(() => {
                        if (this.resetPassword(values, this)) {
                            resetForm();
                            Router.push('/');
                        }
                        setSubmitting(false);
                    }, 500);
                }}
            >
                {
                    ({
                        handleSubmit,
                        handleChange,
                        setFieldValue,
                        setFieldError,
                        values,
                        touched,
                        isValid,
                        errors,
                        handleBlur,
                        isSubmitting
                    }) => (
                        <div className='forgot-password'>
                            <AlertModal
                                onHide={(e) => this.setState({ showToast: false })}
                                show={this.state.showToast}
                                alerttype={'success'}
                                message={'Password changed successfully'}
                            />
                            <Row className="row">
                                <Col lg="auto" md="auto" sm="auto" xs="auto" className='form_col'>
                                    <Form noValidate onSubmit={handleSubmit}>
                                        <Form.Row>
                                            <Col lg={12} md={12} sm={12} xs={12} className='logo_col'>
                                                <Image src="logo.png" fluid style={styles.image} />
                                            </Col>
                                            <Col lg={12} md={12} sm={12} xs={12} className='logo_col'>
                                                <div className='d-flex flex-column ml-3'>
                                                    <div className="text-center welcome_note" >{'Welcome to Grocery SHop'} </div>
                                                    <div className="text-center welcome_note pb-3" >{'Reset Your Password'} </div>
                                                </div>
                                            </Col>
                                        </Form.Row>
                                        <hr className='pt-0 mt-0' />

                                        <Form.Row>
                                            <Form.Group as={Col} lg={12} md={12} sm={12} xs={12}>
                                                <Form.Label style={styles.label}>{'Mobile'}<span>*</span>
                                                    {this.state.isCodeVerified ?
                                                        null
                                                        :
                                                        this.state.isCodeSended && !this.state.isResendCode ?
                                                            <span style={{ color: 'gray', float: 'right', marginRight: '4%' }}> 00 : {this.state.intervalTime}</span>
                                                            :
                                                            null
                                                    }
                                                </Form.Label>
                                                <InputGroup>
                                                    <PhoneInput
                                                        inputStyle={{ width: '100%' }}
                                                        country={'pk'}
                                                        name="mobile"
                                                        onlyCountries={['pk', 'af']}
                                                        value={values.mobile}
                                                        disabled={this.state.isCodeSended}
                                                        onChange={(e) => { handleChange(e) }}
                                                        onChange={phone => { setFieldValue('mobile', '+' + phone), this.setState({ mobileError: '' }) }}
                                                    />
                                                    {this.state.mobileError !== '' && renderError(this.state.mobileError)}
                                                    <div className='feedback'>
                                                        <div className='mr-auto'>{this.state.feedback}</div>
                                                        {this.state.isCodeSended ?
                                                            <a onClick={() =>
                                                                this.setState({
                                                                    isCodeSended: false,
                                                                    isCodeVerified: false,
                                                                    feedback: '',
                                                                    mobileError: '',
                                                                    verificationCodeError: '',
                                                                })
                                                            }>{'Change Number'}</a>
                                                            :
                                                            null
                                                        }
                                                    </div>
                                                </InputGroup>
                                                <InputGroup style={{ marginTop: '20px' }}>
                                                    <CustomButton
                                                        block
                                                        onClick={() => { this.handleSenVerificationCode(values.mobile) }}
                                                        disabled={this.state.isCodeVerified ? true : this.state.isCodeSended ? this.state.isResendCode ? false : true : false}
                                                        title={this.state.isCodeSended ? 'Resend' : 'Send Code'}
                                                        loading={this.state.sendCodeLoading}
                                                    />
                                                </InputGroup>
                                            </Form.Group>
                                            {!this.state.isCodeSended &&
                                                <Form.Group as={Col} lg={12} md={12} sm={12} xs={12}>
                                                    <div id="recaptcha-container"></div>
                                                </Form.Group>
                                            }
                                            <Form.Group as={Col} lg={12} md={12} sm={12} xs={12}>
                                                <Form.Label style={styles.label}>{'Verification Code'}<span> * </span></Form.Label>
                                                <InputGroup>
                                                    <CustomFormControl
                                                        label={'Verification Code'}
                                                        type="text"
                                                        name="verification_code"
                                                        value={values.verification_code}
                                                        onChange={handleChange}
                                                        isInvalid={this.state.verificationCodeError}
                                                        disabled={!this.state.isCodeSended || this.state.isCodeVerified}
                                                    />
                                                    {this.state.isCodeSended ?
                                                        <InputGroup.Append>
                                                            <CustomButton disabled={this.state.isCodeVerified}
                                                                block
                                                                onClick={() => this.handleVerifyVarificationCode(values.verification_code)}
                                                                title={this.state.isCodeVerified ? 'Verified' : 'Verify'}
                                                            />
                                                        </InputGroup.Append>
                                                        : null
                                                    }
                                                    <Form.Control.Feedback type="invalid">
                                                        {this.state.verificationCodeError}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Form.Row>

                                        {this.state.isCodeVerified ?
                                            <>
                                                <Form.Row>
                                                    <Form.Group as={Col} lg={12} md={12} sm={12} xs={12}>
                                                        <Form.Label style={styles.label}>{'New Password'} <span>*</span></Form.Label>
                                                        <InputGroup>
                                                            <CustomFormControl
                                                                placeholder={'Enter new password'}
                                                                type={hide ? 'password' : 'text'}
                                                                name="password"
                                                                value={values.password}
                                                                onChange={handleChange}
                                                                isInvalid={touched.password && errors.password}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.password}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    <Form.Group as={Col} lg={12} md={12} sm={12} xs={12}>
                                                        <Form.Label style={styles.label}>{'Confirm New Password'}<span>*</span></Form.Label>
                                                        <InputGroup>
                                                            <CustomFormControl
                                                                placeholder={'Re-enter password'}
                                                                type={hide ? 'password' : 'text'}
                                                                name="confirm_password"
                                                                value={values.confirm_password}
                                                                onChange={handleChange}
                                                                isInvalid={touched.confirm_password && errors.confirm_password}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors.confirm_password}
                                                            </Form.Control.Feedback>
                                                        </InputGroup>
                                                    </Form.Group>
                                                </Form.Row>
                                                <Form.Row>
                                                    <Form.Group as={Col} controlId="loginGrop">
                                                        <CustomButton
                                                            block
                                                            title='Continue'
                                                            onClick={handleSubmit}
                                                            disabled={this.state.isLoading || !this.state.isCodeVerified}
                                                            loading={this.state.isLoading}
                                                        />
                                                    </Form.Group>
                                                </Form.Row>
                                            </>
                                            :
                                            null
                                        }

                                    </Form>
                                </Col>
                            </Row>
                            <style type="text/css">{`
                                    .forgot-password .row{
                                        align-items: center;
                                        justify-content: center;
                                        margin: 0%;
                                        padding: 0%;
                                    }
                                    .forgot-password .form_col{
                                        width: 400px;
                                        background: ${constants.COLORS.SECONDARY};
                                        padding: 2%;
                                        margin: 5%;
                                    }
                                    .forgot-password .logo_col{
                                        display: flex;
                                        flex-direction: row;
                                        align-items: center;
                                        justify-content: center;
                                        color: ${constants.COLORS.MAIN} 
                                    }
                                    .forgot-password .welcome_note{
                                        font-size: 15px;
                                    }
                                    .forgot-password .append_button{
                                        font-size: 13px;
                                    }
                                    @media (max-width: 574px) {
                                        .forgot-password .append_button {
                                            font-size: 10px;
                                        }
                                        .forgot-password .welcome_note {
                                            font-size: 15px;
                                        }
                                        .forgot-password .form_col{
                                            width: 94%;
                                            margin: 3%;
                                            padding: 3%;
                                        }
                                    }

                                `}</style>
                            <style jsx>
                                {`
                                        .forgot-password {
                                            min-height: 100vh;
                                            background: ${constants.COLORS.WHITE};
                                            position: absolute;
                                            top: 0;
                                            left: 0;
                                            right: 0;
                                        }
                                        .forgot-password span {
                                            color: red;
                                        }
                                        
                                        .forgot-password .feedback{
                                            display: flex;
                                            width: 100%;
                                            font-size: 12.8px;
                                            color: ${constants.COLORS.MAIN};
                                        }
                                        .forgot-password .feedback a{
                                            font-size: 12.8px;
                                            color: blue;
                                            cursor: pointer;
                                        }
                                    `}
                            </style>
                            <style jsx global>{`
                                    html,
                                    body {
                                        padding: 0;
                                        margin: 0;
                                        font-family: Roboto, Helvetica Neue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;
                                    }
                                `}</style>
                        </div >
                    )
                }
            </Formik>
        );
    }
}

const styles = {
    submit_btn: {
        background: `${constants.COLORS.MAIN}`,
        marginTop: '5px'
    },
    image: {
        width: '400px',
        height: '100px',
        marginBottom: '2%',
    },
    errorMsg: {
        color: 'red',
        width: '100%',
        fontSize: `${constants.SIZES.LABEL}`,
    },
    label: {
        width: '100%',
        fontSize: `${constants.SIZES.LABEL}`,
    },
    fontawesome: {
        color: `${constants.COLORS.TEXT}`,
        width: '15px',
        height: '15px',
        maxHeight: '15px',
        maxWidth: '15px',
    },
}

export default ForgotPassword;