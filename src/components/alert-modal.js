import { Modal, Form } from 'react-bootstrap';
import consts from '../constants';

import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { VscError } from 'react-icons/vsc';
import { useEffect } from 'react';
import CustomButton from './CustomButton';

function AlertModal(props) {
    const { onHide, show, alerttype, message } = props;

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="alert-modal"
            centered
        >
            <Modal.Body className='d-flex flex-column justify-content-center align-items-center' style={{ padding: '5%' }}>
                {alerttype == 'success' ?
                    <IoIosCheckmarkCircleOutline style={{ fontSize: '100px', color: consts.COLORS.SUCCESS }} />
                    :
                    <VscError style={{ fontSize: '100px', color: consts.COLORS.DANGER }} />
                }
                <Modal.Title id="alert-modal" style={{ textAlign: 'center', alignSelf: 'center', fontWeight: 'bold' }}>
                    {alerttype === 'success' ? 'Success' : 'Error'}
                </Modal.Title>
                <Form.Label style={{ fontSize: '14px', padding: '0%', margin: '2% 0%', textAlign: 'center', minWidth: '100%' }}>
                    {message}
                </Form.Label>
                <CustomButton
                    block
                    size='lg'
                    title={'Close'}
                    onClick={() => onHide()}
                />
            </Modal.Body>
        </Modal>
    );
}

export default AlertModal;