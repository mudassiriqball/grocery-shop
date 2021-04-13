import { Component } from 'react';
import { Formik } from 'formik'
import { Form, InputGroup, Col, Row, ButtonGroup, Alert } from 'react-bootstrap';
import * as yup from 'yup';
import CustomButton from '../components/CustomButton';
import consts from '../constants';
import globalStyle from '../utils/styles/globalStyle';
import PhoneInput from 'react-phone-input-2';
import firebase from '../utils/services/firebase'
import axios from 'axios'
import urls from '../utils/urls';

import { BiUserPlus, BiLock, BiKey, BiArrowBack } from 'react-icons/bi'
import { AiOutlineMail, AiOutlineEye } from 'react-icons/ai'
import { TiTickOutline } from 'react-icons/ti'
import { FiSend } from 'react-icons/fi'
import { BsEyeSlash } from 'react-icons/bs'
import { FaRegAddressCard } from 'react-icons/fa'
import renderError from '../components/renderError';

const schema = yup.object({
    email: yup.string().email('Enter Valid Email!')
        .max(100, 'Can\'t be Grater than 100 characters!'),
    fullName: yup.string().required('Required *')
        .min(5, 'Must be Greater than 5 Characters!')
        .max(25, 'Can\'t be Greater than 25 Characters!'),
    mobile: yup.string(),
    city: yup.string().required('Required *')
        .min(3, 'Must be Greater than 3 Characters!')
        .max(25, 'Can\'t be Greater than 25 Characters!'),
    address: yup.string().required('Required *')
        .min(5, 'Must be Greater than 5 Characters!')
        .max(150, 'Can\'t be Greater than 150 Characters!'),
    licenseNo: yup.string(),
    password: yup.string().required('Required *')
        .min(8, 'Must be At least 8 Characters!')
        .max(20, 'Can\'t be Greater than 20 Characters!'),
    confirm_password: yup.string().required('Required *').when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: yup.string().oneOf(
            [yup.ref("password")],
            'Password Should Match!'
        )
    }),
    role: yup.string().required('Required *'),
});

class Signup extends Component {
    state = {
        hide: true,
        isLoading: false,
        sendCodeLoading: false,
        showToast: false,
        serverErrorMsg: '',

        phone: '',
        mobileError: '',
        feedback: '',
        intervalTime: 60,

        code: '',
        verificationCodeError: '',
        isCodeSended: false,
        isCodeVerified: false,
        verificationLoading: false,

        licenseError: '',
        showAlert: false,
    };

    componentDidMount() {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container",
            {
                size: "invisible",
                callback: (response) => {
                    // RECAPTCHA solved, allow signInWithPhoneNumber.
                },
                "expired-callback": (response) => {
                    // RECAPTCHA Expired
                    console.log("reCAPTCH expired :");
                },
                onload: (response) => {
                    console.log("reCAPTCHA loaded:", response);
                }
            },
        );
    }

    async handleSenVerificationCode(mobileNumber) {
        this.setState({ phone: mobileNumber, sendCodeLoading: true, mobileError: '' })
        const currentComponent = this;
        await axios.get(urls.GET_REQUEST.VARIFY_MOBILE_NUMBER + mobileNumber)
            .then((res) => {
                if (res.data.code == 201) {
                    currentComponent.setState({
                        mobileError: 'Number Already Exists!',
                        feedback: '',
                        isCodeSended: false,
                        isCodeVerified: false,
                        sendCodeLoading: false,
                    })
                } else {
                    currentComponent.setState({
                        sendCodeLoading: false,
                        intervalTime: 60,
                        isResendCode: false,
                        feedback: '',
                    });
                    // Send code to number
                    var appVerifier = window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container",
                        {
                            size: "invisible",
                            callback: (response) => {
                                // RECAPTCHA solved, allow signInWithPhoneNumber.
                            },
                            "expired-callback": (response) => {
                                // RECAPTCHA Expired
                                console.log("reCAPTCH expired :");
                                currentComponent.setState({
                                    mobileError: 'RECAPTCHA Expired',
                                });
                            },
                            onload: (response) => {
                                console.log("reCAPTCHA loaded:", response);
                            }
                        },
                    );
                    firebase.auth().signInWithPhoneNumber(mobileNumber, appVerifier)
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
                                    mobileError: "Some problem occur while sending OTP (or initializing recaptcha)",
                                    feedback: '',
                                    isCodeVerified: false,
                                })
                            }
                            console.log('send code error:', error)
                        });
                }
            }).catch((error) => {
                currentComponent.setState({
                    mobileError: 'Something went wront! Please try again later.',
                    sendCodeLoading: false,
                })
                console.log('error number exist check:', error)
            })
    }


    showPassword = ev => {
        this.setState({ hide: !this.state.hide })
    }

    handleVerifyVarificationCode = (code) => {
        const currentComponent = this
        this.setState({ verificationCodeError: '', verificationLoading: true })
        confirmationResult.confirm(code).then(function (result) {
            currentComponent.setState({
                isCodeVerified: true,
                feedback: 'Number Verified',
                verificationCodeError: '',
                isResendCode: false,
                verificationLoading: false
            })
        }).catch(function (error) {
            console.log('error verification:', error)
            currentComponent.setState({
                verificationCodeError: 'Invalid Code!',
                feedback: '',
                verificationLoading: false
            })
        });
    }

    render() {

        let eyeBtn;
        if (this.state.hide) {
            eyeBtn = <AiOutlineEye style={globalStyle.mediumMainIcon} />;
        } else {
            eyeBtn = <BsEyeSlash style={globalStyle.mediumMainIcon} />;
        }
        return (
            <div className='signup'>
                <Formik
                    validationSchema={schema}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                        const currentComponent = this;
                        values.mobile = this.state.phone;
                        console.log('values:', values)
                        if (values.role === 'customer' && values.licenseNo === '') {
                            this.setState({ licenseError: 'Required *' });
                            setSubmitting(false);
                        } else {
                            this.setState({ licenseError: '' });
                            setTimeout(async () => {
                                if (this.state.isCodeVerified && this.state.isCodeSended) {
                                    await axios.post(urls.POST_REQUEST.SIGNUP, values).then(function (res) {
                                        currentComponent.setState({
                                            hide: true,
                                            isLoading: false,
                                            sendCodeLoading: false,
                                            showToast: false,
                                            serverErrorMsg: '',
                                            phone: '',
                                            mobileError: '',
                                            feedback: '',
                                            intervalTime: 60,
                                            code: '',
                                            verificationCodeError: '',
                                            isCodeSended: false,
                                            isCodeVerified: false,
                                            verificationLoading: false,
                                            licenseError: '',
                                            showAlert: true,
                                        });
                                        resetForm();
                                        setSubmitting(false);
                                        // Router.push('/');
                                    }).catch(function (error) {
                                        console.log('Signup error:', error)
                                        currentComponent.setState({ isLoading: false, serverErrorMsg: 'Signup Failed, Please try again' })
                                        setSubmitting(false);
                                    })
                                } else {
                                    setSubmitting(false);
                                    alert('Verify your number first')
                                }
                            }, 400);
                        }
                    }}
                    initialValues={{
                        mobile: '', fullName: '', email: '', password: '', confirm_password: '',
                        city: '', role: '', address: '', licenseNo: ''
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        resetForm,
                        setFieldValue
                    }) => (
                        <div className='container'>
                            {this.state.showAlert && <Alert variant='success' onClose={() => this.setState({ showAlert: false })} dismissible>
                                {'Account Created Successfully, Go to '}
                                <Alert.Link href="/">Home</Alert.Link>
                                {' and login'}
                            </Alert>
                            }
                            <Form noValidate onSubmit={handleSubmit}>
                                {values.role === '' &&
                                    <>
                                        <Form.Row>
                                            <Form.Group as={Col} lg='6' md="6" sm='12' xs='12' controlId="validationFormik01">
                                                <Form.Label>Mobile *</Form.Label>
                                                <PhoneInput
                                                    inputStyle={{ width: '100%' }}
                                                    country={'pk'}
                                                    onlyCountries={['pk', 'af']}
                                                    value={this.state.phone}
                                                    disabled={this.state.isCodeSended}
                                                    onChange={phone => this.setState({ phone: "+" + phone, mobileError: '' })}
                                                />
                                                {renderError(this.state.mobileError)}
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
                                            </Form.Group>
                                            <Form.Group as={Col} lg='6' md="6" sm='12' xs='12'>
                                                <Form.Label>Code *</Form.Label>
                                                <Form.Control
                                                    type="number"
                                                    name="code"
                                                    placeholder='Enter Verification Code'
                                                    value={this.state.code}
                                                    onChange={(e) => this.setState({ code: e.target.value })}
                                                    isInvalid={this.state.verificationCodeError}
                                                    isValid={this.state.isCodeVerified}
                                                    disabled={!this.state.isCodeSended || this.state.isCodeVerified}
                                                />
                                                {renderError(this.state.verificationCodeError)}
                                            </Form.Group>
                                        </Form.Row>
                                        {!this.state.isCodeSended &&
                                            <Form.Group as={Col} lg={12} md={12} sm={12} xs={12}>
                                                <div id="recaptcha-container"></div>
                                            </Form.Group>
                                        }
                                        <Form.Row>
                                            <Form.Group as={Col} lg='6' md="6" sm='12' xs='12'>
                                                <CustomButton
                                                    size={'sm'}
                                                    loading={this.state.sendCodeLoading}
                                                    disabled={this.state.isCodeVerified ? true : this.state.isCodeSended ? this.state.isResendCode ? false : true : false}
                                                    title={this.state.isCodeSended ? 'Resend' : 'Send Code'}
                                                    onClick={() => this.handleSenVerificationCode(this.state.phone)}
                                                >
                                                    {!this.state.sendCodeLoading && <FiSend style={{ fontSize: 15, marginRight: '5px' }} />}
                                                </CustomButton>
                                            </Form.Group>
                                            {/* Verify Code */}
                                            <Form.Group as={Col} lg='6' md="6" sm='12' xs='12'>
                                                {this.state.isCodeSended &&
                                                    <CustomButton
                                                        size={'sm'}
                                                        loading={this.state.verificationLoading}
                                                        title={this.state.isCodeVerified ? 'Verified' : 'Verify'}
                                                        onClick={() => this.handleVerifyVarificationCode(this.state.code)}
                                                        disabled={this.state.isCodeVerified}
                                                    >
                                                        <TiTickOutline style={{ fontSize: 20, marginRight: '5px' }} />
                                                    </CustomButton>
                                                }
                                            </Form.Group>
                                            <div style={{ borderBottom: `0.5px solid ${consts.COLORS.MUTED}`, width: '100%', marginBottom: '10px' }}></div>
                                        </Form.Row>
                                    </>
                                }
                                {values.role == '' && this.state.isCodeVerified && <Row>
                                    <Row className='w-100'><label style={{ fontSize: '20px', width: '100%', textAlign: 'center' }}>Signup as ?</label></Row>
                                    <Col lg='6' md='6' sm='12' xs='12' className='mb-1'>
                                        <CustomButton
                                            block
                                            title={'Customer'}
                                            onClick={() => setFieldValue('role', 'customer')}
                                        >
                                            <BiUserPlus style={globalStyle.leftIcon} />
                                        </CustomButton>
                                    </Col>
                                    <Col lg='6' md='6' sm='12' xs='12'>
                                        <CustomButton
                                            block
                                            title={'Delivery Boy'}
                                            onClick={() => setFieldValue('role', 'delivery')}
                                        >
                                            <BiUserPlus style={globalStyle.leftIcon} />
                                        </CustomButton>
                                    </Col>
                                </Row>
                                }

                                {values.role !== '' &&
                                    <>
                                        <Form.Row>
                                            {/* Full Name */}
                                            <Form.Group as={Col} lg='6' md="6" sm='12' xs='12'>
                                                <Form.Label>Full Name *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter Full Name"
                                                    name="fullName"
                                                    value={values.fullName}
                                                    onChange={handleChange}
                                                    isInvalid={touched.fullName && errors.fullName}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.fullName}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            {/* City */}
                                            <Form.Group as={Col} lg='6' md="6" sm='12' xs='12'>
                                                <Form.Label>City *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Enter City"
                                                    name="city"
                                                    value={values.city}
                                                    onChange={handleChange}
                                                    isInvalid={touched.city && errors.city}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors.city}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            {/* Address */}
                                            <Form.Group as={Col} lg='12' md="12" sm='12' xs='12' controlId="validationFormikUsername">
                                                <Form.Label>Address *</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text id="inputGroupPrepend">
                                                            <FaRegAddressCard style={globalStyle.mediumMainIcon} />
                                                        </InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter Address"
                                                        name="address"
                                                        value={values.address}
                                                        onChange={handleChange}
                                                        isInvalid={touched.address && errors.address}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.address}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>

                                            {/* License No */}
                                            {values.role == 'customer' &&
                                                <Form.Group as={Col} lg={values.role == 'customer' ? '6' : '12'} md={values.role == 'customer' ? '6' : '12'} sm='12' xs='12'>
                                                    <Form.Label>License Number *</Form.Label>
                                                    <InputGroup>
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text id="inputGroupPrepend">
                                                                <BiKey style={globalStyle.mediumMainIcon} />
                                                            </InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter License Number"
                                                            name="licenseNo"
                                                            value={values.licenseNo}
                                                            onChange={(e) => { setFieldValue('licenseNo', e.target.value), this.setState({ licenseError: '' }) }}
                                                            isInvalid={this.state.licenseError}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {this.state.licenseError}
                                                        </Form.Control.Feedback>
                                                    </InputGroup>
                                                </Form.Group>
                                            }
                                            {/* Email */}
                                            <Form.Group as={Col} lg={values.role == 'customer' ? '6' : '12'} md={values.role == 'customer' ? '6' : '12'} sm='12' xs='12' controlId="validationFormikUsername">
                                                <Form.Label>Email</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Prepend>
                                                        <InputGroup.Text id="inputGroupPrepend">
                                                            <AiOutlineMail style={globalStyle.mediumMainIcon} />
                                                        </InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter Email"
                                                        name="email"
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        isInvalid={touched.email && errors.email}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors.email}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                            {/* Password */}
                                            <Form.Group as={Col} lg='6' md="6" sm='12' xs='12' controlId="validationFormikUsername">
                                                <Form.Label>Password *</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Prepend onClick={() => this.showPassword()}>
                                                        <InputGroup.Text >
                                                            {values.password == '' ?
                                                                <BiLock style={globalStyle.mediumMainIcon} />
                                                                :
                                                                eyeBtn
                                                            }
                                                        </InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        type={this.state.hide ? 'password' : 'text'}
                                                        placeholder="Enter Password"
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
                                            <Form.Group as={Col} lg='6' md="6" sm='12' xs='12' controlId="validationFormikUsername">
                                                <Form.Label>Confirm Password *</Form.Label>
                                                <InputGroup>
                                                    <InputGroup.Prepend onClick={() => this.showPassword()}>
                                                        <InputGroup.Text >
                                                            {values.confirm_password == '' ?
                                                                <BiLock style={globalStyle.mediumMainIcon} />
                                                                :
                                                                eyeBtn
                                                            }
                                                        </InputGroup.Text>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        type={this.state.hide ? 'password' : 'text'}
                                                        placeholder="Confirm Password"
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
                                        <Form.Group>
                                            <label className='w-100' style={{ textAlign: 'center', fontSize: 12, color: consts.COLORS.SEC }}>By Signing up you are agree to Terms & Condition and Privacy Statement</label>
                                        </Form.Group>
                                        <Form.Label style={{ fontSize: consts.SIZES.LABEL, color: consts.COLORS.ERROR }}>
                                            <span>{this.state.serverErrorMsg}</span>
                                        </Form.Label>
                                        <Row>
                                            <Col>
                                                <CustomButton
                                                    block
                                                    title={'Back'}
                                                    onClick={() => setFieldValue('role', '')}
                                                    disabled={isSubmitting}
                                                >
                                                    <BiArrowBack style={globalStyle.leftIcon} />
                                                </CustomButton>
                                            </Col>
                                            <Col>
                                                <CustomButton
                                                    block
                                                    loading={isSubmitting}
                                                    disabled={isSubmitting}
                                                    title={'Signup'}
                                                    onClick={handleSubmit}
                                                >
                                                    {!isSubmitting && <BiUserPlus style={globalStyle.leftIcon} />}
                                                </CustomButton>
                                            </Col>

                                        </Row>
                                    </>
                                }
                            </Form>
                        </div>
                    )}
                </Formik>

                <style jsx>{`
                    .signup {
                        min-height: 100vh;
                        background: ${consts.COLORS.SECONDARY};
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                    }
                    .signup {
                        min-width: 100%;
                        min-height: 100vh;
                        justify-contents: center;
                        display: flex;
                        padding: ${consts.SIZES.BASE};
                    }
                    .signup .feedback{
                        display: flex;
                        width: 100%;
                        font-size: 12.8px;
                        color: green;
                    }
                    .signup .feedback a{
                        font-size: 12.8px;
                        color: blue;
                        cursor: pointer;
                    }
                    .signup .container {
                        background: ${consts.COLORS.WHITE};
                        border-radius: 5px;
                        border: 1px solid ${consts.COLORS.MUTED};
                        padding: 2%;
                        align-self: center;
                    };
                    // Small devices (landscape phones, 576px and up)
                    @media (min-width: 576px) {
                        .signup .container {
                            min-width: 90%;
                            max-width: 90%;
                        };
                    }

                    // Medium devices (tablets, 768px and up)
                    @media (min-width: 768px) {
                        .signup .container {
                            min-width: 80%;
                            max-width: 80%;
                        };
                    }

                    // Medium devices (tablets, 768px and up)
                    @media (min-width: 768px) {
                        .signup .container {
                            min-width: 80%;
                            max-width: 80%;
                        };
                    }

                    // Large devices (desktops, 992px and up)
                    @media (min-width: 992px) {
                        .signup .container {
                            min-width: 60%;
                            max-width: 60%;
                        };
                    }

                    // Extra large devices (large desktops, 1200px and up)
                    @media (min-width: 1200px) {
                        .signup .container {
                            min-width: 50%;
                            max-width: 50%;
                        };
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
        );
    }
}

export default Signup;