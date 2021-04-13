import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col, Card, Nav, Table, Form, Button, InputGroup, Image } from 'react-bootstrap'
import { faUsers, faUserPlus, faPersonBooth, faBan, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp, faCheckCircle } from '@fortawesome/free-regular-svg-icons';

import constants from '../constants';
import TitleRow from '../components/title-row';
import ConfirmModal from '../components/confirm-modal';
import AlertModal from '../components/alert-modal';

import PaginationRow from '../components/pagination-row'
import CardSearchAccordion from '../components/card-search-accordion';

import getUsersPageLimit from '../hooks/getUsersPageLimit';
import getUsersBySearch from '../hooks/getUsersBySearch';

import Loading from '../components/loading';
import urls from '../utils/urls';
import { checkTokenExpAuth, getTokenFromStorage } from '../utils/services/auth';

class Customers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh_count: 0,
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

            token: null,
            user: {
                _id: '', fullName: '', mobile: '', city: '',  address: '',
                email: '', status: '', role: '', wishList: '', cart: '', entry_date: ''
            }
        }
    }

    async componentDidMount() {
        const _decodedToken = await checkTokenExpAuth()
        if (_decodedToken != null) {
            await this.authUser(_decodedToken.role);
            this.setState({ user: _decodedToken });
            this.getUser(_decodedToken._id);
            // Token
            const _token = await getTokenFromStorage();
            if (_token !== null)
                this.setState({ token: _token });
        } else {
            Router.push('/')
        }
    }
    async authUser(role) {
        if (role !== 'ministory') {
            Router.push('/')
        }
    }
    async getUser(id) {
        let currentComponent = this
        await axios.get(urls.GET_REQUEST.USER_BY_ID + id).then((res) => {
            currentComponent.setState({ user: res.data.data[0] })
        }).catch((err) => {
            console.log('Get user error in admin:', err);
        })
    }

    async handleViewModalConfirmed() {
        this.setState({ viewConfirmModalLoading: true })
        const currentComponent = this
        let data = []
        if (this.state.method == 'Discarded') {
            setConfirmModalLoading(true)
            await axios.delete(urls.DELETE_REQUEST.DISCARD_NEW_CUSTOMER + this.state.single_user._id, {
                headers: { 'authorization': currentComponent.state.token }
            }).then(function (res) {
                currentComponent.setState({
                    viewConfirmModalLoading: false,
                    showViewConfirmModal: false,
                    alertMsg: 'New Customer Discarded Successfully',
                    alertType: 'success',
                    showAlert: true,
                    refresh_count: currentComponent.state.refresh_count + 1,
                })
            }).catch((err) => {
                currentComponent.setState({
                    viewConfirmModalLoading: false,
                    showViewConfirmModal: false,
                    alertMsg: 'New customer Discarded failed, Please try again later.',
                    alertType: 'error',
                    showAlert: true,
                })
            });
            return
        } else if (this.state.method == 'Approved') {
            data = {
                status: 'approved'
            }
            await axios.put(urls.PUT_REQUEST.CHANGE_CUSTOMER_STATUS + currentComponent.state.single_user._id, data, {
                headers: { 'authorization': currentComponent.state.token }
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
    }

    render() {
        if (this.state.user.role !== 'ministory') {
            return <Loading />
        }
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
                    confirm={this.handleViewModalConfirmed.bind(this)}
                    loading={this.state.viewConfirmModalLoading}
                />
                <AlertModal
                    onHide={() => this.setState({ showAlert: false })}
                    show={this.state.showAlert}
                    message={this.state.alertMsg}
                    alerttype={this.state.alertType}
                />
                <TitleRow icon={faUsers} title={' Ministory Dashboard / Customers'} />
                <CustomersTable
                    header={'New Customers'}
                    rank={false}
                    token={this.state.token}
                    status={'disapproved'}
                    refresh={this.state.refresh_count}
                    setRefresh={() => this.setState({ refresh_count: this.state.refresh_count + 1 })}
                />
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

    const [showAlert, setShowAlert] = useState(false)
    const [alertType, setAlertType] = useState('');
    const [alertMsg, setAlertMsg] = useState(false)

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

    async function handleConfirmed() {
        let data = []
        if (method == 'Discarded') {
            setConfirmModalLoading(true)
            await axios.delete(urls.DELETE_REQUEST.DISCARD_NEW_CUSTOMER + single_user._id, {
                headers: { 'authorization': props.token }
            }).then(function (res) {
                setConfirmModalLoading(false)
                setShowConfirmModal(false)

                setAlertType('success');
                setAlertMsg('User discarded successfully')
                setShowAlert(true)

                setpageNumber(1)
                setQueryPageNumber(1)
                setPage(1)
                setQueryPage(1)
                props.setRefresh()
            }).catch(function (err) {
                setConfirmModalLoading(false)
                setShowConfirmModal(false)

                setAlertType('error');
                setAlertMsg('User Discard Failed')
                setShowAlert(true)
            });
            return
        } else if (method == 'Approved') {
            setConfirmModalLoading(true)
            data = {
                status: 'approved'
            }
            await axios.put(urls.PUT_REQUEST.CHANGE_CUSTOMER_STATUS + single_user._id, data, {
                headers: { 'authorization': props.token }
            }).then(function (res) {
                setConfirmModalLoading(false)
                setShowConfirmModal(false)
                setAlertType('success');
                setAlertMsg('User approved successfully')
                setShowAlert(true)
                setpageNumber(1)
                setQueryPageNumber(1)
                setPage(1)
                setQueryPage(1)
                props.setRefresh()
            }).catch(function (err) {
                setConfirmModalLoading(false)
                setShowConfirmModal(false)

                setAlertType('error');
                setAlertMsg('Something went wrong, Please try again later.')
                setShowAlert(true)
            });
        }
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
                confirm={handleConfirmed}
                loading={confirmModalLoading}
            />
            <AlertModal
                onHide={(e) => setShowAlert(false)}
                show={showAlert}
                alerttype={alertType}
                message={alertMsg}
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
                                    <Nav.Link className='pt-0' onClick={() => props.setApprove(element)}>Approve</Nav.Link>
                                    <Nav.Link className='pt-0 delete' onClick={() => props.setDiscard(element)}>Discard</Nav.Link>
                                </div>
                            </td>
                            <td align="center" >{element.mobile}</td>
                            <td align="center" >{element.fullName}</td>
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

export default Customers;

