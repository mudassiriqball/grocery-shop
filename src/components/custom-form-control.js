import React from 'react';
import { Form } from 'react-bootstrap'
import renderError from './renderError';

const CustomFormControl = (props) => (
    <>
        <Form.Control
            // style={props.style}
            // as={props.as}
            // size={props.size}
            // type={props.type}
            // placeholder={msg}
            // name={props.name}
            // value={props.value}
            // onKeyPress={props.onKeyPress}
            // onChange={props.onChange}
            // isInvalid={props.isInvalid}
            // disabled={props.disabled}
            {...props}
        />
        {props.error != '' && renderError(props.error)}
    </>
)
export default CustomFormControl
