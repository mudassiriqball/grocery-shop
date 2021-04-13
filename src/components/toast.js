import { Toast, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ShowToast = props => {
    return (
        <div
            style={{
                position: 'absolute',
                top: '40%',
                right: '40%',
                zIndex: '100'
            }}
        >
            {/* onClose={props.onCloseHandler} */}
            <Toast show={props.show} delay={10000} autohide={true} style={{
                display: 'absolute',
                background: '#e6ffe6',
                width: '300px',
                border: `0.5px solid ${props.color}`
            }}>
                <Toast.Header>
                    <FontAwesomeIcon icon={props.iconName} style={{
                        color: `${props.color}`,
                        width: '35px',
                        height: '35px',
                        maxHeight: '35px',
                        maxWidth: '35px',
                    }} className="mr-auto"></FontAwesomeIcon>
                    <span style={{ marginLeft: '20px', fontSize: '18px', color: `${props.color}`, fontWeight: 'bold' }} className="mr-auto">{props.header}</span>
                </Toast.Header>
                <Toast.Body style={styles.toastBody}>
                    <p style={{ textAlign: 'center' }}>
                        <span className="mr-auto">{props.message}</span>
                    </p>
                </Toast.Body>
            </Toast>
            {/* <style jsx>{`
                span {
                    width: 100%
                }
            `}</style> */}
        </div >
    )
}

export default ShowToast;


const styles = {
    toastBody: {
        fontSize: '16px',
        padding: '10px',
    },
}