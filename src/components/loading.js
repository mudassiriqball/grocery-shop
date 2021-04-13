import React from 'react'
import { Spinner } from 'react-bootstrap'


export default function Loading() {
    return (
        <>
            <div className='_div'>
                <Spinner animation="border" variant="primary" />
            </div>
            <style jsx>{`
                ._div{
                    display: flex;
                    justify-content: center;
                    padding: 10% 0%;
                    width: 100%;
                    height: 100%;
                }
            `}</style>
        </>
    )
}
