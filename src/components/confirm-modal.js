import { Modal, Button, Form, Spinner, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Loading from './loading';

function ConfirmModal(props) {
    return (
        <Modal
            show={props.show} onHide={props.onHide}
            size="md"
            aria-labelledby="alert-modal"
            centered
        >
            <div style={{
                padding: '20px',
                overflow: 'hidden'
            }}>
                {/* '#ff3333' */}
                <Modal.Header closeButton >
                    <Modal.Title id="alert-modal">
                        {props.title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    {props.loading ?
                        <Loading />
                        :
                        <Row>
                            <Col lg={4} md={4} sm={12} xs={12} className='d-flex justify-content-center'>
                                <FontAwesomeIcon icon={props.iconname} style={{
                                    color: `${props.color}`,
                                    width: '80px',
                                    height: '80px',
                                    maxHeight: '80px',
                                    maxWidth: '80px',
                                }} ></FontAwesomeIcon>
                            </Col>
                            <Col lg={8} md={8} sm={12} xs={12} className='d-flex flex-column justify-content-center'>
                                <Form.Label style={{ fontSize: '14px', padding: '0%', margin: '0%' }}>
                                    <span style={{ fontWeight: 'bold' }}> Name: </span>
                                    {props.name}
                                </Form.Label>
                                <br />
                                <Form.Label style={{ fontSize: '14px', padding: '0%', margin: '0%' }}>
                                    <span style={{ fontWeight: 'bold' }}> ID: </span>
                                    {props._id}
                                </Form.Label>
                            </Col>
                        </Row>
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button size="sm" className='mr-auto' onClick={props.confirm}
                        disabled={props.loading}
                        variant={props.color == 'red' ? 'outline-danger' : props.color == 'blue' ? 'outline-primary' : 'outline-success'}>Confirm</Button>
                    <Button size="sm" variant='outline-primary' disabled={props.loading} onClick={props.onHide}>Cancel</Button>
                </Modal.Footer>
            </div>
        </Modal>
    );
}

export default ConfirmModal