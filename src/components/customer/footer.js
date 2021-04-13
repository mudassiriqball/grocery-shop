import React from 'react'
import { Card, Col, Row } from 'react-bootstrap';
import consts from '../../constants';
import { AiFillTwitterCircle, AiFillInstagram } from 'react-icons/ai';
import { FaFacebook } from 'react-icons/fa';

export default function Footer() {
    return (
        <div className='footer'>
            <Card className='_card' style={{ background: consts.COLORS.SEC, border: 'none', }}>
                <Card.Body className='text-white'>
                    <Row>
                        <Col lg={4} md={4} sm={6} xs={12} style={{ padding: '2%' }}>
                            <h1 className='header'>ABOUT US</h1>
                            <p className='paragraph'>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                        </Col>
                        <Col lg={4} md={4} sm={6} xs={12} style={{ padding: '2%' }}>
                            <Card style={{ background: consts.COLORS.MAIN, border: 'none', height: '400px' }}>
                                <Card.Body className='text-white'>
                                    <h1 className='card_header'>GET IN TOUCH</h1>
                                    <p className='paragraph'>+92 335 9929528</p>
                                    <p className='paragraph'>afghandarmaltoon@gmail.com</p>
                                    <p className='paragraph'>H-10 Islamabad, Pakistan</p>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={4} md={4} sm={6} xs={12} style={{ padding: '2%' }}>
                            <h1 className='header'>WHAT WE DO</h1>
                            <p className='paragraph'>CBD Oil
                            Medical Cannabis
                            Edibles
                            Topicals
                            Cannabis Extract
                            Cannabis Accesories
                            </p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <Row noGutters style={{ background: consts.COLORS.SEC_HOVER, padding: '2% 0%' }}>
                <Col lg={6} md={6} sm={6} xs={12} className='d-flex justify-content-center align-items-center' >
                    <h5 style={{ color: 'white', textAlign: 'center', pading: '0px' }}>Copyright By@Afghan Darmaltoon - 2020</h5>
                </Col>
                <Col lg={6} md={6} sm={6} xs={12} className='d-flex flex-row justify-content-center align-items-center' >
                    <div className='dotViewIcon'>
                        <FaFacebook style={styles.dotsSocialIconFB} />
                    </div>
                    <div className='dotViewIcon'>
                        <AiFillTwitterCircle style={styles.dotsSocialIcon} />
                    </div>
                    <div className='dotViewIcon'>
                        <AiFillInstagram style={styles.dotsSocialIcon} />
                    </div>
                </Col>
            </Row>
            <style jsx>{`
                .footer {
                    background: ${consts.COLORS.SEC};
                    left: 0;
                    bottom: 0;
                    right: 0;
                    min-width: 100%;
                    max-width: 100%;
                }
                .footer .dotViewIcon{
                    cursor: pointer;
                    // height: 100%;
                }
                .footer .dotViewIcon:hover {
                    background: ${consts.COLORS.MAIN};
                    border-radius: 20px;
                }
                .footer ._card {
                    background: ${consts.COLORS.SEC};
                    padding: 3% 15%;
                }
                .footer .card_header {
                    color: ${consts.COLORS.SEC};
                    font-size: 30px;
                    font-weight: 1000;
                    text-align: center;
                }
                .footer .header {
                    font-size: 30px;
                    font-weight: bold;
                    text-align: center;
                }
                .footer .paragraph {
                    font-size: 16px;
                    text-align: center;
                    line-height: 40px;
                }
            `}</style>
        </div >
    )
}
const styles = {
    dotsSocialIcon: {
        color: consts.COLORS.WHITE,
        fontSize: '50px',
        margin: '5px',
    },
    dotsSocialIconFB: {
        color: consts.COLORS.WHITE,
        fontSize: '47px',
        margin: '5px',
    }

}