import React from 'react';
import { Col, Row } from 'react-bootstrap';
import consts from '../../constants';
import { GrDeliver, GrSupport } from 'react-icons/gr';
import { GiMoneyStack } from 'react-icons/gi';

export default function InfoRow(props) {
    return (
        <div className='infoRow'>
            <Row noGutters>
                <Col lg={4} md={4} sm={12} xs={12} className='_col'>
                    <GrDeliver style={{ fontSize: '30px', marginRight: '25px' }} />
                    <div className='text_div'>
                        <h6>Free Delivery</h6>
                        <label>Free shipping on all order</label>
                    </div>
                </Col>
                <Col lg={4} md={4} sm={12} xs={12} className='_col'>
                    <GiMoneyStack style={{ fontSize: '30px', marginRight: '25px' }} />
                    <div className='text_div'>
                        <h6>Money Return</h6>
                        <label>Guarantee under 7 days</label>
                    </div>
                </Col>
                <Col lg={4} md={4} sm={12} xs={12} className='_col'>
                    <GrSupport style={{ fontSize: '30px', marginRight: '25px' }} />
                    <div className='text_div'>
                        <h6>Support 24/7</h6>
                        <label>Support online 24 hours a day</label>
                    </div>
                </Col>
            </Row>
            <style type='text/css'>{`
                .infoRow {
                    padding: 2% 5%;
                    background: ${consts.COLORS.SHADOW};
                    margin: 2% 0%;  
                }
                .infoRow ._col {
                    flex-direction: row;
                    justify-content: center;
                    display: flex;
                    margin: 0px;
                }
                .infoRow .text_div {
                    flex-direction: column;
                }
                .infoRow h6 {
                    font-weight: bold;
                }
                .infoRow label {
                    font-size: 14px;
                    font-weight: bold;
                    color: gray;
                }
                 @media (max-width: 767px){
                    .infoRow {
                        padding: 5%;
                    }
                    .infoRow ._col {
                        justify-content: flex-start;
                    }
                }
                 @media (max-width: 575px){
                     .infoRow {
                        padding: 5%;
                    }
                    .infoRow ._col {
                        justify-content: flex-start;
                    }
                }
            `}</style>
        </div>
    )
}
