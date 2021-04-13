import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col, Card, Nav, Table, Form, Button, InputGroup, Image } from 'react-bootstrap'
import { faUsers, faUserPlus, faPersonBooth, faBan, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp, faCheckCircle } from '@fortawesome/free-regular-svg-icons';

import constants from '../../../constants';
import TitleRow from '../../title-row';
import ConfirmModal from '../../confirm-modal';
import AlertModal from '../../alert-modal';

import PaginationRow from '../../pagination-row'
import CardSearchAccordion from '../../card-search-accordion';

import getUsersPageLimit from '../../../hooks/getUsersPageLimit';
import getUsersBySearch from '../../../hooks/getUsersBySearch';

import Loading from '../../loading';
import urls from '../../../utils/urls';

class Customers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh_count: 0,
            isViewUser: false,
            isNewUser: false,
            single_user: {},
            method: '',
            showViewConfirmModal: false,
            viewConfirmModalMsg: '',
            viewModalIconname: null,
            viewConfirmModalColor: '',
            viewConfirmModalLoading: false,

            showAlert: false,
            alertMsg: '',
            alertType: '',
        }
    }

    async handleUpdateStatus() {
        this.setState({ viewConfirmModalLoading: true })
        const currentComponent = this
        let data = []
        if (this.state.method == 'Approved') {
            data = {
                status: 'approved'
            }
        } else if (this.state.method == 'Discarded') {
            setConfirmModalLoading(true)
            await axios.delete(urls.DELETE_REQUEST.DISCARD_NEW_CUSTOMER + this.state.single_user._id, {
                headers: { 'authorization': currentComponent.props.token }
            }).then(function (res) {
                currentComponent.setState({
                    viewConfirmModalLoading: false,
                    showViewConfirmModal: false,
                    alertMsg: 'New Customer Discarded Successfully',
                    alertType: 'success',
                    showAlert: true,
                    refresh_count: currentComponent.state.refresh_count + 1,
                    isViewUser: false,
                })
                currentComponent.props.usersReloadCountHandler()
            }).catch((err) => {
                currentComponent.setState({
                    viewConfirmModalLoading: false,
                    showViewConfirmModal: false,
                    alertMsg: 'New customer Ddiscarded failed, Please try again later.',
                    alertType: 'error',
                    showAlert: true,
                })
                console.log('New customer Ddiscarded failed, Please try again later.', err);
            });
            return
        } else if (this.state.method === 'Restricted') {
            data = {
                status: 'restricted'
            }
        } else if (this.state.method === 'Unrestricted') {
            data = {
                status: 'approved'
            }
        }

        await axios.put(urls.PUT_REQUEST.CHANGE_CUSTOMER_STATUS + currentComponent.state.single_user._id, data, {
            headers: { 'authorization': currentComponent.props.token }
        }).then((res) => {
            currentComponent.setState({
                viewConfirmModalLoading: false,
                showViewConfirmModal: false,
                alertMsg: `Customer ${currentComponent.state.method}  successfully`,
                alertType: 'success',
                showAlert: true,
                refresh_count: currentComponent.state.refresh_count + 1
            })
            let obj = {}
            obj = currentComponent.state.single_user
            obj.status = data.status
            currentComponent.setState({ single_user: obj })
            currentComponent.props.usersReloadCountHandler()
        }).catch((err) => {
            currentComponent.setState({
                viewConfirmModalLoading: false,
                showViewConfirmModal: false,
                alertMsg: `Customer ${currentComponent.state.method} failed, Please try again later`,
                alertType: 'error',
                showAlert: true,
            })
            console.log(`Customer ${currentComponent.state.method} failed, Please try again later`, err);
        });
    }

    render() {
        return (
            <div className='customers'>
                <ConfirmModal
                    onHide={() => { this.setState({ showViewConfirmModal: false, viewConfirmModalLoading: false }) }}
                    show={this.state.showViewConfirmModal}
                    title={this.state.viewConfirmModalMsg}
                    iconname={this.state.viewModalIconname}
                    color={this.state.viewConfirmModalColor}
                    _id={this.state.single_user._id}
                    name={this.state.single_user.fullName}
                    confirm={this.handleUpdateStatus.bind(this)}
                    loading={this.state.viewConfirmModalLoading}
                />
                <AlertModal
                    onHide={() => this.setState({ showAlert: false })}
                    show={this.state.showAlert}
                    message={this.state.alertMsg}
                    alerttype={this.state.alertType}
                />
                {!this.state.isViewUser ?
                    <div>
                        <TitleRow icon={faUsers} title={' Admin Dashboard / Customers'} />
                        <CustomersTable
                            header={'All Customers'}
                            rank={true}
                            setView={(element) => this.setState({
                                isViewUser: true,
                                isNewUser: false,
                                single_user: element,
                            })}
                            token={this.props.token}
                            status={'approved'}
                            refresh={this.state.refresh_count}
                            setRefresh={() => this.setState({ refresh_count: this.state.refresh_count + 1 })}
                            usersReloadCountHandler={this.props.usersReloadCountHandler}
                        />

                        <CustomersTable
                            header={'New Customers'}
                            rank={false}
                            setView={(element) => this.setState({
                                isViewUser: true,
                                isNewUser: true,
                                single_user: element,
                            })}
                            token={this.props.token}
                            status={'disapproved'}
                            refresh={this.state.refresh_count}
                            setRefresh={() => this.setState({ refresh_count: this.state.refresh_count + 1 })}
                            usersReloadCountHandler={this.props.usersReloadCountHandler}
                        />
                        <CustomersTable
                            header={'Restricted Customers'}
                            rank={true}
                            setView={(element) => this.setState({
                                isViewUser: true,
                                isNewUser: false,
                                single_user: element,
                            })}
                            token={this.props.token}
                            status={'restricted'}
                            refresh={this.state.refresh_count}
                            setRefresh={() => this.setState({ refresh_count: this.state.refresh_count + 1 })}
                            usersReloadCountHandler={this.props.usersReloadCountHandler}
                        />
                    </div>
                    :
                    <>
                        <TitleRow icon={faPersonBooth} title={`Admin Dashboard / Customers / ${this.state.single_user.fullName}`} />
                        <Form.Row style={{ margin: ' 1% 2%', display: 'flex', alignItems: 'center' }} >
                            <Button size='sm' variant='outline-primary' className="mr-auto" onClick={() => this.setState({ isViewUser: false })}> Back </Button>
                            {this.state.isNewUser ?
                                <>
                                    <Button size='sm' variant='outline-success' className='m2'
                                        onClick={() => this.setState({
                                            showViewConfirmModal: true, viewConfirmModalMsg: 'Approve New Customer?', method: 'Approved',
                                            viewConfirmModalColor: 'green', viewModalIconname: faCheckCircle
                                        })}
                                    > Approve </Button>
                                    <Button size='sm' variant='outline-danger' className=''
                                        onClick={() => this.setState({
                                            showViewConfirmModal: true, viewConfirmModalMsg: 'Discard New Customer?', method: 'Discarded',
                                            viewConfirmModalColor: 'red', viewModalIconname: faCheckCircle
                                        })}
                                    > Discard </Button>
                                </>
                                :
                                <>
                                    {this.state.single_user.status != 'restricted' ?
                                        <Button size='sm' variant='outline-danger' className='ml-2 mt-2 mb-2'
                                            onClick={() => this.setState({
                                                showViewConfirmModal: true, viewConfirmModalMsg: 'Restrict Customer?', method: 'Restricted',
                                                viewConfirmModalColor: 'red', viewModalIconname: faCheckCircle
                                            })}
                                        > Restrict </Button>
                                        :
                                        <Button size='sm' variant='outline-success' className='ml-2  mt-2 mb-2'
                                            onClick={() => this.setState({
                                                showViewConfirmModal: true, viewConfirmModalMsg: 'Unrestrict Customer?', method: 'Unrestricted',
                                                viewConfirmModalColor: 'blue', viewModalIconname: faCheckCircle,
                                            })}
                                        > Unrestrict </Button>
                                    }
                                </>
                            }
                        </Form.Row>
                        <Card className='view_user'>
                            <Card.Body>
                                <Row>
                                    <Form.Group as={Col} lg={12} md={12} sm={12} xs={12} className='d-flex justify-content-center align-items-center pt-3 pb-3' style={{ background: constants.COLORS.SECONDARY }}>
                                        <InputGroup style={{ width: '100px', height: '100px', borderRadius: '50%' }}>
                                            <Image src={this.state.single_user && this.state.single_user.avatar && this.state.single_user.avatar}
                                                style={{ width: '100px', height: '100px', borderRadius: '50%', background: constants.COLORS.WHITE }}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <p className='p'><span>Personal Info</span></p>
                                    <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
                                        <Form.Label className='form_label'>ID</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user._id} className='form_control' />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
                                        <Form.Label className='form_label'>Mobile</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.mobile} className='form_control' />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
                                        <Form.Label className='form_label'>Email</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.email || '-'} className='form_control' />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
                                        <Form.Label className='form_label'>Full Name</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.fullName} className='form_control' />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
                                        <Form.Label className='form_label'>City</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.city} className='form_control' />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} lg={12} md={12} sm={12} xs={12}>
                                        <Form.Label className='form_label'>Address</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.address} className='form_control' />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
                                        <Form.Label className='form_label'>Status</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.status} className='form_control' />
                                        </InputGroup>
                                    </Form.Group>
                                    <Form.Group as={Col} lg={4} md={6} sm={6} xs={12}>
                                        <Form.Label className='form_label'>Entry Date</Form.Label>
                                        <InputGroup>
                                            <Form.Control type="text" disabled={true} size="sm" value={this.state.single_user.entry_date.substring(0, 10)} className='form_control' />
                                        </InputGroup>
                                    </Form.Group>
                                </Row>
                            </Card.Body>
                        </Card>
                    </>
                }
                <style type="text/css">
                    {`
                        .customers .Card{
                            margin: 1%;
                        }
                        .customers .view_user{
                            margin: 1% 2%;
                        }
                        .customers .p {
                            width: 100%; 
                            text-align: center; 
                            border-bottom: 1px solid lightgray; 
                            line-height: 0.1em;
                            margin: 20px 20px;
                        } 

                        .customers .p span {
                            font-size: 13px;
                            color: gray;
                            background: white;
                            padding:0 10px;
                        }
                        .customers .form_label{
                            color: gray;
                            font-size: ${constants.SIZES.LABEL};
                        }
                        .customers .card_header {
                            font-size: ${constants.SIZES.HEADER};
                            border: none;
                        }
                        .customers .card_text {
                            color: ${constants.admin_primry_color};
                            font-size: 17px;
                        }
                        .customers .form_control:disabled {
                            background: none;
                            // border: none;
                            // padding-left: 0%;
                            // padding-top: 0%;
                            font-size: 14px;
                            font-weight: bold;
                        }
                    `}
                </style>
            </div>
        )
    }
}

function CustomersTable(props) {
    const [page, setPage] = useState(1);
    const [queryPage, setQueryPage] = useState(1);
    const [pageNumber, setpageNumber] = useState(1);
    const [queryPageNumber, setQueryPageNumber] = useState(1);
    const [isSearch, setIsSearch] = useState(false);
    const [fieldName, setFieldName] = useState('');
    const [query, setQuery] = useState('');

    const [single_user, setSingle_vendor] = useState({});
    // Confirm Modal
    const [method, setMethod] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmModalMsg, setConfirmModalMsg] = useState('');
    const [confirmModalColor, setConfirmModalColor] = useState('green');
    const [confirmModalLoading, setConfirmModalLoading] = useState(false)

    const [showAlertModal, setShowAlertModal] = useState(false)
    const [alertModalMsg, setAlertModalMsg] = useState(false)

    const [iconname, setIconname] = useState(null);

    const { USERS_PAGE_LOADING, USERS_PAGE_ERROR, USERS_PAGE_USERS, USERS_PAGE_PAGES, USERS_PAGE_TOTAL } =
        getUsersPageLimit(props.token, props.refresh, 'customer', props.status, pageNumber, '20')
    const { USERS_SEARCH_LOADING, USERS_SEARCH_ERROR, USERS_SEARCH_USERS, USERS_SEARCH_PAGES, USERS_SEARCH_TOTAL } =
        getUsersBySearch(props.token, props.refresh, 'customer', props.status, fieldName, query, queryPageNumber, '20')

    async function handleSearch(type, value, start, end) {
        if (value != '') {
            setFieldName(type)
            setQuery(value)
            setIsSearch(true)
        } else {
            setIsSearch(false)
        }
    }

    function handleSetPage(ppage) {
        if (ppage > page) {
            setPage(ppage)
            setpageNumber(ppage)
        } else {
            setPage(ppage)
        }
    }

    function handleSetQueryPage(ppage) {
        if (ppage > page) {
            setQueryPage(ppage)
            setQueryPageNumber(ppage)
        } else {
            setQueryPage(ppage)
        }
    }

    async function handleUpdateStatus() {
        let data = []
        if (method == 'Approved') {
            setConfirmModalLoading(true)
            data = {
                status: 'approved'
            }
        } else if (method == 'Discarded') {
            setConfirmModalLoading(true)
            await axios.delete(urls.DELETE_REQUEST.DISCARD_NEW_CUSTOMER + single_user._id, {
                headers: { 'authorization': props.token }
            }).then(function (res) {
                setConfirmModalLoading(false)
                setShowConfirmModal(false)
                setAlertModalMsg('Customer deleted successfully')
                setShowAlertModal(true)
                setpageNumber(1)
                setQueryPageNumber(1)
                setPage(1)
                setQueryPage(1)
                props.setRefresh()
                props.usersReloadCountHandler()
            }).catch(function (err) {
                setConfirmModalLoading(false)
                setShowConfirmModal(false)
                alert('User Discard Failed: ');
                console.log('User Discard Failed:', err)
            });
            return
        } else if (method == 'Restricted') {
            setConfirmModalLoading(true)
            data = {
                status: 'restricted'
            }
        } else if (method == 'Unrestricted') {
            setConfirmModalLoading(true)
            data = {
                status: 'approved'
            }
        }

        await axios.put(urls.PUT_REQUEST.CHANGE_CUSTOMER_STATUS + single_user._id, data, {
            headers: { 'authorization': props.token }
        }).then(function (res) {
            setConfirmModalLoading(false)
            setShowConfirmModal(false)
            setAlertModalMsg(`Customer ${method}  successfully`)
            setShowAlertModal(true)
            setpageNumber(1)
            setQueryPageNumber(1)
            setPage(1)
            setQueryPage(1)
            props.setRefresh()
            props.usersReloadCountHandler()
        }).catch(function (err) {
            setConfirmModalLoading(false)
            setShowConfirmModal(false)
            alert(`User ${method} failed: `);
            console.log(`User ${method} failed: `, err)
        });
    }

    return (
        <div className='vendors_table'>
            <ConfirmModal
                onHide={() => { setShowConfirmModal(false), setConfirmModalLoading(false) }}
                show={showConfirmModal}
                title={confirmModalMsg}
                iconname={iconname}
                color={confirmModalColor}
                _id={single_user._id}
                name={single_user.fullName}
                confirm={handleUpdateStatus}
                loading={confirmModalLoading}
            />
            <AlertModal
                onHide={(e) => setShowAlertModal(false)}
                show={showAlertModal}
                alerttype={'success'}
                message={alertModalMsg}
            />

            <CardSearchAccordion
                title={props.header}
                option={'customer'}
                handleSearch={handleSearch}
                setIsSearch={() => setIsSearch(false)}
            >
                {!isSearch ?
                    USERS_PAGE_LOADING ?
                        <Loading />
                        :
                        USERS_PAGE_TOTAL > 0 ?
                            <>
                                <CustomerTableBody
                                    pageNumber={page}
                                    list={USERS_PAGE_USERS}
                                    rank={props.rank}
                                    setView={props.setView}
                                    setApprove={(element) => {
                                        setMethod('Approved')
                                        setSingle_vendor(element)
                                        setShowConfirmModal(true)
                                        setConfirmModalMsg('Approve Customer?')
                                        setConfirmModalColor('green')
                                        setIconname(faCheckCircle)
                                    }}
                                    setDiscard={(element) => {
                                        setMethod('Discarded')
                                        setSingle_vendor(element)
                                        setShowConfirmModal(true)
                                        setConfirmModalMsg('Discard New Customer?')
                                        setConfirmModalColor('red')
                                        setIconname(faTrash)
                                    }}
                                    setRestrict={(element) => {
                                        setMethod('Restricted')
                                        setSingle_vendor(element)
                                        setShowConfirmModal(true)
                                        setConfirmModalMsg('Restrict Customer?')
                                        setConfirmModalColor('red')
                                        setIconname(faBan)
                                    }}
                                    setUnrestrict={(element) => {
                                        setMethod('Unrestricted')
                                        setSingle_vendor(element)
                                        setShowConfirmModal(true)
                                        setConfirmModalMsg('Unrestrict/Unblock Customer?')
                                        setConfirmModalColor('blue')
                                        setIconname(faCheckCircle)
                                    }}
                                />
                                <hr />
                                <PaginationRow
                                    totalPages={USERS_PAGE_PAGES}
                                    activePageNumber={page}
                                    setActivePageNumber={(ppage) => handleSetPage(ppage)}
                                />
                            </>
                            :
                            <Row className='no_data'>No Data Found</Row>
                    :
                    USERS_SEARCH_LOADING ?
                        <Loading />
                        :
                        USERS_SEARCH_TOTAL ?
                            <>
                                <CustomerTableBody
                                    pageNumber={queryPage}
                                    list={USERS_SEARCH_USERS}
                                    rank={props.rank}
                                    setView={props.setView}
                                    setApprove={(element) => {
                                        setMethod('Approved')
                                        setSingle_vendor(element)
                                        setShowConfirmModal(true)
                                        setConfirmModalMsg('Approve Customer?')
                                        setConfirmModalColor('green')
                                        setIconname(faCheckCircle)
                                    }}
                                    setDiscard={(element) => {
                                        setMethod('Discarded')
                                        setSingle_vendor(element)
                                        setShowConfirmModal(true)
                                        setConfirmModalMsg('Discard New Customer?')
                                        setConfirmModalColor('red')
                                        setIconname(faTrash)
                                    }}
                                    setRestrict={(element) => {
                                        setMethod('Restricted')
                                        setSingle_vendor(element)
                                        setShowConfirmModal(true)
                                        setConfirmModalMsg('Restrict Customer?')
                                        setConfirmModalColor('red')
                                        setIconname(faBan)
                                    }}
                                    setUnrestrict={(element) => {
                                        setMethod('Unrestricted')
                                        setSingle_vendor(element)
                                        setShowConfirmModal(true)
                                        setConfirmModalMsg('Unrestrict/Unblock Customer?')
                                        setConfirmModalColor('blue')
                                        setIconname(faCheckCircle)
                                    }}
                                />
                                <hr />
                                <PaginationRow
                                    totalPages={USERS_SEARCH_PAGES}
                                    activePageNumber={queryPage}
                                    setActivePageNumber={(ppage) => handleSetQueryPage(ppage)}
                                />
                            </>
                            :
                            <Row className='no_data'>No Data Found</Row>
                }
            </CardSearchAccordion>
            <style type="text/css">{`
                .vendors_table .no_data {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 5% 0%;
                }
            `}</style>
        </div>
    )
}

function CustomerTableBody(props) {
    const [lower_limit, setlower_limit] = useState(0)
    const [upper_limit, setupper_limit] = useState(0)

    useEffect(() => {
        setlower_limit(props.pageNumber * 20 - 20);
        setupper_limit(props.pageNumber * 20);

        return () => {
            setlower_limit;
            setupper_limit;
        }
    }, [props.pageNumber])

    return (
        <div className='vendor_table'>
            <Table responsive bordered hover size="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID</th>
                        <th>Mobile</th>
                        <th>Name</th>
                        <th>City</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {props.list && props.list.map((element, index) =>
                        index >= lower_limit && index < upper_limit && <tr key={index}>
                            <td align="center" >{index + 1}</td>
                            <td>
                                {element._id}
                                <div className="td">
                                    <Nav.Link className='pt-0' onClick={() => props.setView(element)} > View </Nav.Link>
                                    {props.rank ?
                                        <>
                                            {element.status == 'restricted' ?
                                                <Nav.Link className='pt-0' onClick={() => props.setUnrestrict(element)}>Unrestrict</Nav.Link>
                                                :
                                                <Nav.Link className='pt-0 delete' onClick={() => props.setRestrict(element)}>Restrict</Nav.Link>
                                            }
                                        </>
                                        :
                                        <>
                                            <Nav.Link className='pt-0' onClick={() => props.setApprove(element)}>Approve</Nav.Link>
                                            <Nav.Link className='pt-0 delete' onClick={() => props.setDiscard(element)}>Discard</Nav.Link>
                                        </>
                                    }
                                </div>
                            </td>
                            <td align="center" >{element.mobile}</td>
                            <td align="center" >{element.fullName}</td>
                            <td align="center" >{element.city}</td>
                            <td align="center" >{element.entry_date.substring(0, 10)}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <style jsx>
                {`
                th {
                    text-align: center;
                    font-size: 14px;
                    white-space: nowrap;
                }
                .vendor_table .td {
                    display: flex;
                    flex-direction: row;
                    font-size: 12px;
                    float: right;
                    padding: 0%;
                    margin: 0%;
                }
                .vendor_table td {
                    font-size: 12px;
                }
            `}
            </style>
            <style type="text/css">{`
                .vendor_table .delete{
                    color: #ff4d4d;
                }
                .vendor_table .delete:hover{
                    color: #cc0000;
                }
            `}</style>
        </div>
    )
}


const styles = {
    fontawesome: {
        color: `${constants.admin_primry_color}`,
        width: '30px',
        height: '30px',
        maxHeight: '30px',
        maxWidth: '30px',
        float: 'right'
    },
    accordin_fontawesome: {
        color: `${constants.admin_primry_color}`,
        marginRight: '10%',
        width: '15px',
        height: '15px',
        maxHeight: '15px',
        maxWidth: '15px',
    },
}

export default Customers;

