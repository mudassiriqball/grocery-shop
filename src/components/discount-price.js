import React, { useState, useEffect } from 'react'
import translate from '../../i18n/translate'

export default function DiscountPrice(props) {
    const [discounted_price, setdiscounted_price] = useState(0)

    useEffect(() => {
        let unmounted = true
        let count = props.price - props.discount / 100 * props.price
        let rounded = Math.floor(count);
        let decimal = count - rounded;
        if (decimal > 0 && unmounted) {
            setdiscounted_price(rounded + 1)
        } else if (unmounted) {
            setdiscounted_price(rounded)
        }
        return () => {
        }
    }, [props])

    return (
        <div>
            {!props.isShowProuct &&
                <div className='d-inline-flex align-items-center w-100'>
                    <label className='mr-auto price_label'>{translate('rs')}{discounted_price}</label>
                </div>
            }
            {props.discount != '0' ?
                <div className='d-inline-flex'>
                    <p className='discount_label'>
                        {translate('rs')}
                        {props.price}
                    </p>
                    <div className='percent'>{' -' + props.discount + '%'}</div>
                </div>
                :
                <div className='d-inline-flex'>
                    <div style={{ fontSize: '13px', paddingLeft: '2px' }}>{'-0%'}</div>
                </div>
            }
            <style type="text/css">{`
                .price_label {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap; 
                    display: block;
                    padding: 0%;
                    margin: 1.5% 1% 0% 1%;
                    color: Orange;
                    font-size: 15px;
                    cursor: pointer;
                }
                .percent {
                    font-size: 13px;
                    padding-left: 15px;
                }
                .discount_label {
                    width: 100%;
                    color: gray;
                    margin: 0%;
                    padding-left: 2px;
                    text-decoration-line: line-through;
                    font-size: 13px;
                }
            `}</style>
        </div>
    )
}
