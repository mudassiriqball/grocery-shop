import React from 'react'
import { Card } from 'react-bootstrap';
import { BiArrowBack } from 'react-icons/bi';
import consts from '../../constants';
import Router from 'next/router';

export default function SimpleToolbar(props) {
    const { title } = props;

    return (
        <div className='_simpleToolbar'>
            <Card style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
                <Card.Body className='d-flex flex-row align-items-center'>
                    <BiArrowBack onClick={() => Router.back()} style={{ fontSize: '20px', fontWeight: 'bold', marginRight: 'auto', color: consts.COLORS.GRAY }} />
                    <h6 style={{ marginRight: 'auto', marginLeft: '-20px', fontWeight: 'bold', color: consts.COLORS.GRAY }}>{title}</h6>
                </Card.Body>
            </Card>
            <style jsx>{`
                ._simpleToolbar {
                    width: 100%;
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
