import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';

import consts from '../../../constants'
import TitleRow from '../../title-row';
class AdminDashboard extends React.Component {
    render() {
        return (
            <div >
                <TitleRow icon={faTachometerAlt} title={' Admin Dashboard'} />
                <style jsx>
                    {`
                        .hover {
                            margin: 5px 15px
                        }
                        .hover:hover {
                            margin: 0px 10px;
                            cursor: pointer
                        }
                    `}
                </style>
            </div>
        )
    }
}

const styles = {
    row: {
        margin: '2%',
        padding: '0px'
    },
    col: {
        padding: '0px',
        margin: '0px'
    },
    card: {
        background: 'white',
        borderRadius: '0px',
        padding: '0px'
    },
    card_header: {
        background: 'white',
        color: 'gray',
        border: 'none'
    },
    card_text: {
        color: '#6A7074',
        fontSize: '30px',
    },
    fontawesome: {
        color: `${consts.COLORS.SEC}`,
        width: '50px',
        height: '50px',
        maxHeight: '50px',
        maxWidth: '50px',
        float: 'right'
    },
}

export default AdminDashboard;