import React from 'react'
import { Button, Spinner } from 'react-bootstrap'

export default function CustomButton(props) {
    const { variant, loading, title, spinnerVariant, spinnerSize, onlyLoading, size } = props;
    return (
        <Button
            // variant={variant ? variant : 'danger'}
            variant={'danger'}
            size={size ? size : 'sm'}
            style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}
            {...props}
        >
            {loading && <Spinner animation="border"
                size={spinnerSize ? spinnerSize : 'sm'}
                style={{ marginRight: 5 }}
                role="status"
                variant={spinnerVariant}
            />
            }
            {props.children}
            {onlyLoading ?
                loading ?
                    null
                    :
                    title
                : title
            }
        </Button>
    )
}
