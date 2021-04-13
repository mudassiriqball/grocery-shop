import React, { Component } from 'react';
import { Accordion, Form, InputGroup, Col, Button, Row, Card, Modal, Nav } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import consts from '../../../../constants';
import Select, { components } from 'react-select';
import AlertModal from '../../../alert-modal'


const groupStyles = {
    border: `1px solid ${consts.COLORS.ADMIN_MAIN}`,
    borderRadius: '5px',
    background: 'white',
    color: `${consts.COLORS.ADMIN_MAIN}`,
};

const Group = props => (
    <div style={groupStyles}>
        <components.Group {...props} />
    </div>
);


const CustomFields = props => {
    const [modalShow, setModalShow] = React.useState(false);
    const [fieldName, setFieldName] = React.useState('');
    const [fieldValue, setFieldValue] = React.useState('');
    const [error, setError] = React.useState('');
    const [userStatusAlert, setUserStatusAlert] = React.useState(false);
    const [statusAlertMessage, setStatusAlertMessage] = React.useState('');

    function handleAddCustomFieldBtnClick() {
        if (fieldName != '' && fieldValue != '') {
            const copyArray = Object.assign([], props.customFieldsArray)
            copyArray.push({
                name: fieldName,
                value: fieldValue,
            })
            props.setFieldsArrayHandler(copyArray)
            setError('');
            setFieldName('');
            setFieldValue('');
        } else {
            setError('Enter Field Name and Value');
        }
    }

    function deleteCustomFieldsClick(index) {
        const copyArray = Object.assign([], props.customFieldsArray);
        copyArray.splice(index, 1);
        props.setFieldsArrayHandler(copyArray)

    }

    return (
        <div className='specifications'>
            <AlertModal
                onHide={(e) => setUserStatusAlert(false)}
                show={userStatusAlert}
                alerttype={'error'}
                message={statusAlertMessage}
                iconname={faExclamationTriangle}
                color={"#ff3333"}
            />
            <Form.Row style={{ margin: '0%', padding: '1.5%', background: `${consts.COLORS.SECONDARY}` }}>
                <Form.Group as={Col} lg={5} md={5} sm={12} xs={12}>
                    <Form.Label style={styles.label}>Field Name</Form.Label>
                    <Form.Control
                        style={{ fontSize: '14px' }}
                        type="text"
                        placeholder="Enter Name"
                        value={fieldName}
                        onChange={(e) => setFieldName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group as={Col} lg={7} md={7} sm={12} xs={12}>
                    <Form.Label style={styles.label}>Field Value </Form.Label>
                    <InputGroup>
                        <Form.Control
                            style={{ fontSize: '14px' }}
                            type="text"
                            placeholder="Enter Value"
                            value={fieldValue}
                            onChange={(e) => setFieldValue(e.target.value)}
                        />
                        <Button variant="outline-primary" size="sm" style={{ marginLeft: '1%' }} onClick={handleAddCustomFieldBtnClick}>Add</Button>
                    </InputGroup>
                </Form.Group>
                <span className="mr-auto"> {error} </span>
            </Form.Row>

            {/* Map */}
            <div style={{ background: `${consts.COLORS.SECONDARY}`, marginTop: '1%' }}>
                {props.customFieldsArray && props.customFieldsArray.map((element, index) =>
                    <Form.Row style={{ padding: '1% 2%' }} key={index}>
                        <Col lg={5} md={5} sm={12} xs={12}>
                            <Form.Control
                                type="text"
                                size="sm"
                                placeholder="Enter Name"
                                value={element.name}
                                disabled
                                onChange={() => element.name}
                            />
                        </Col>
                        <Col lg={7} md={7} sm={12} xs={12}>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    placeholder="Enter Value"
                                    disabled
                                    value={element.value}
                                    onChange={() => element.value}
                                />
                                <Button variant="outline-danger" size="sm" style={{ marginLeft: '1%' }}
                                    onClick={() => deleteCustomFieldsClick(index)}> delete</Button>
                            </InputGroup>
                        </Col>
                    </Form.Row>
                )}
            </div>
            <style type="text/css">{`
                .specifications {
                    // min-height: 300px;
                    position: relative;
                    z-index: 10;
                }
            `}</style>
            <style jsx>{`
                span {
                    color: red;
                    font-size: 13px
                }
            `}</style>
        </div>
    )
}

const styles = {
    row: {
        margin: '2%',
        padding: '0%'
    },
    card: {
        width: '100%'
    },
    card_header: {
        width: '100%',
        alignItems: 'center',
        // color: '#6A7074',
        fontSize: `${consts.SIZES.HEADER}`,
        background: `${consts.COLORS.HEADER_BACKGROUND}`,
    },
    label: {
        fontSize: '13px',
    },
    accordin_fontawesome: {
        color: `${consts.COLORS.ADMIN_MAIN}`,
        marginRight: '10%',
        width: '15px',
        height: '15px',
        maxHeight: '15px',
        maxWidth: '15px',
    },
}
export default CustomFields;