
import React, { useState, useEffect } from 'react';
import { Row, Table, Button, Nav, Col, Image, Form, InputGroup, Alert, } from 'react-bootstrap'
import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTimes, faChevronLeft, faChevronRight, faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import CardAccordion from '../../card-accordion';
import urls from '../../../utils/urls/index'
import consts from '../../../constants'
import TitleRow from '../../title-row';

import getInventoryPageLimit from '../../../hooks/admin/getInventoryPageLimit';
import getInventorySearch from '../../../hooks/admin/getInventorySearch';

import useDimensions from "react-use-dimensions";
import ConfirmModal from '../../confirm-modal'
import AlertModal from '../../alert-modal';
import PaginationRow from '../../pagination-row'
import Loading from '../../loading';
import CardSearchAccordion from '../../card-search-accordion'
import renderError from '../../renderError';
import constants from '../../../constants';


export default function OutOfStock(props) {
    const [page, setPage] = useState(1)
    const [queryPage, setQueryPage] = useState(1)

    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false)
    // Alert Stuff
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertType, setAlertType] = useState('');

    const [viewProduct, setViewProduct] = useState(false)
    const [data, setData] = useState({})

    const [isSearch, setIsSearch] = useState(false)
    const [refresh_count, setRefresh_count] = useState(0)

    const [fieldName, setFieldName] = useState('')
    const [limitPageNumber, setlimitPageNumber] = useState(1);
    const [queryPageNumber, setQueryPageNumber] = useState(1);
    const [query, setQuery] = useState('')

    const { INVENTORY_PRODUCTS_LOADING, INVENTORY_PRODUCTS, INVENTRY_PAGES } = getInventoryPageLimit(refresh_count, limitPageNumber, '20', true);
    const { INVENTORY_SEARCH_LOADING, INVENTORY_SEARCH_ERROR, INVENTORY_SEARCH_PRODUCTS, INVENTRY_SEARCH_PAGES } =
        getInventorySearch(refresh_count, fieldName, query, queryPageNumber, '20', true);

    async function handleSearch(searchType, searchValue) {
        if (searchValue != '') {
            setFieldName(searchType)
            setQuery(searchValue)
            setIsSearch(true)
        } else {
            setIsSearch(false)
        }
    }

    function handleSetPage(ppage) {
        if (ppage > page) {
            setPage(ppage)
            setlimitPageNumber(ppage)
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

    function handleShowConfirmModal(element) {
        setData(element)
        setShowConfirmDeleteModal(true)
    }

    // Delete
    const [deleteLoading, setDeleteLoading] = useState(false);
    async function handleDeleteProduct(element) {
        setDeleteLoading(true);
        await axios.put(urls.PUT_REQUEST.DELETE_PRODUCT + data._id, {}, {
            headers: {
                'authorization': props.token
            }
        }).then(function (response) {
            setDeleteLoading(false);
            setShowConfirmDeleteModal(false);

            setAlertMsg('Product deleted successfully');
            setAlertType('success');
            setShowAlert(true);

            setViewProduct(false);
            setRefresh_count(refresh_count + 1);
        }).catch(function (error) {
            console.log(error);
            setDeleteLoading(false);
            setShowConfirmDeleteModal(false);

            setAlertMsg('Update delete failed, Please try again later.');
            setAlertType('error');
            setShowAlert(true);
        });
    }

    // Update Product
    const [isUpdate, setIsUpdate] = useState(false);
    const [showUpdateConfirmModal, setShowUpdateConfirmModal] = useState(false);
    const [updateLoading, setUpdateLoading] = useState(false);
    const handleUpdateProduct = async (updatedData) => {
        setUpdateLoading(true);
        await axios.put(urls.PUT_REQUEST.UPDATE_PRODUCT + data._id, updatedData, {
            headers: {
                'authorization': props.token
            }
        }).then(function (response) {
            setUpdateLoading(false);
            setShowUpdateConfirmModal(false);
            setAlertMsg('Product updated successfully');
            setAlertType('success');
            setShowAlert(true);
            setViewProduct(false);
            setRefresh_count(refresh_count + 1);
        }).catch(function (error) {
            console.log(error);
            setUpdateLoading(false);
            setShowUpdateConfirmModal(false);
            setAlertMsg('Update product failed, Please try again later.');
            setAlertType('error');
            setShowAlert(true);
        });
    }


    function renderSwitch(param) {
        switch (param) {
            case 'view':
                return <ViewProduct
                    data={data}
                    isUpdate={isUpdate}
                    back={() => { setViewProduct(false), setData(data) }}
                    cancel={() => setIsUpdate(false)}
                    edit={() => setIsUpdate(true)}

                    deleteLoading={deleteLoading}
                    setDeleteLoading={(val) => setDeleteLoading(val)}
                    handleDeleteProduct={() => handleDeleteProduct()}

                    showUpdateConfirmModal={showUpdateConfirmModal}
                    setShowUpdateConfirmModal={(val) => setShowUpdateConfirmModal(val)}
                    updateLoading={updateLoading}
                    handleUpdateProduct={(updatedData) => handleUpdateProduct(updatedData)}
                />
                break;
            default:
                return <>
                    <TitleRow icon={faPlus} title={' Vendor Dashboard / All Products'} />
                    <CardSearchAccordion
                        title={'Out Of Stock Inventory'}
                        option={'inventory'}
                        value={query}
                        handleSearch={handleSearch}
                        setIsSearch={() => setIsSearch(false)}
                    >
                        {!isSearch ?
                            INVENTORY_PRODUCTS_LOADING ?
                                <Loading />
                                :
                                INVENTORY_PRODUCTS && INVENTORY_PRODUCTS.length > 0 ?
                                    <>
                                        <ProductTable
                                            list={INVENTORY_PRODUCTS}
                                            pageNumber={page}
                                            setViewProduct={(element) => { setData(element), setViewProduct('view') }}
                                            handleEditProduct={(element) => { setData(element), setIsUpdate(true), setViewProduct('view') }}
                                            handleShowConfirmModal={(element) => handleShowConfirmModal(element)}
                                        />
                                        <hr />
                                        <PaginationRow
                                            totalPages={INVENTRY_PAGES}
                                            activePageNumber={page}
                                            setActivePageNumber={(ppage) => handleSetPage(ppage)}
                                        />
                                    </>
                                    :
                                    <Row className='_div'>No Data Found</Row>
                            :
                            INVENTORY_SEARCH_LOADING ?
                                <Loading />
                                :
                                INVENTORY_SEARCH_PRODUCTS && INVENTORY_SEARCH_PRODUCTS.length > 0 ?
                                    <>
                                        <ProductTable
                                            list={INVENTORY_SEARCH_PRODUCTS}
                                            pageNumber={queryPage}
                                            setViewProduct={(element) => { setData(element), setViewProduct('view') }}
                                            handleEditProduct={(element) => { setData(element), setIsUpdate(true), setViewProduct('view') }}
                                            handleShowConfirmModal={(element) => handleShowConfirmModal(element)}
                                        />
                                        <hr />
                                        <PaginationRow
                                            totalPages={INVENTRY_SEARCH_PAGES}
                                            activePageNumber={queryPage}
                                            setActivePageNumber={(ppage) => handleSetQueryPage(ppage)}
                                        />
                                    </>
                                    :
                                    <Row className='_div'>No Data Found</Row>
                        }
                    </CardSearchAccordion >
                </>
        }
    }

    return (
        <div className='adin_inventory'>
            <AlertModal
                onHide={() => setShowAlert(false)}
                show={showAlert}
                alerttype={alertType}
                message={alertMsg}
            />
            <ConfirmModal
                onHide={() => setShowConfirmDeleteModal(false)}
                show={showConfirmDeleteModal}
                iconname={faTrash}
                color={'red'}
                title={'Delete Product?'}
                _id={data._id}
                name={data.name}
                confirm={handleDeleteProduct}
                loading={deleteLoading}
            />

            {renderSwitch(viewProduct)}

            <style type="text/css">{`
                .adin_inventory ._div{
                    display: flex;
                    justify-content: center;
                    margin: 5%;
                }
                .adin_inventory .form_label{
                    font-size: 12px;
                }
                @media (max-width: 575px){
                    .adin_inventory .search_col{
                        padding-top: 1%;
                    }
                }
            `}</style>
            <style jsx >{`
                th{
                    font-size: 14px;
                }
            `}</style>
        </div>
    )
}

function ProductTable(props) {
    const [lower_limit, setlower_limit] = useState(0)
    const [upper_limit, setupper_limit] = useState(0)

    useEffect(() => {
        setlower_limit(props.pageNumber * 20 - 20)
        setupper_limit(props.pageNumber * 20)

        return () => {
            setlower_limit;
            setupper_limit;
        }
    }, [props.pageNumber])

    return (
        <div className='admin_product_table'>
            <Table responsive bordered hover size="sm">
                <thead>
                    <tr>
                        <th style={{ textAlign: 'center' }}>#</th>
                        <th style={{ textAlign: 'center' }}>ID</th>
                        <th style={{ textAlign: 'center' }}>Name</th>
                        <th style={{ textAlign: 'center' }}>Price</th>
                        <th style={{ textAlign: 'center' }}>Stock</th>
                        <th style={{ textAlign: 'center' }}>Category</th>
                        <th style={{ textAlign: 'center' }}>Sub Category</th>
                        <th style={{ textAlign: 'center' }}>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {props.list && props.list.map((element, index) =>
                        element && element.stock < constants.SIZES.LESS_STOCK ?
                            index >= lower_limit && index < upper_limit ?
                                <tr key={index} style={(element && element.stock < constants.SIZES.LESS_STOCK) ? { background: constants.COLORS.LIGHT_RED } : {}}>
                                    <td align="center" >{index + 1}</td>
                                    <td >
                                        {element._id}
                                        <div className="td">
                                            <Nav.Link style={styles.nav_link} className='pt-0' onClick={() => props.setViewProduct(element)} >View</Nav.Link>
                                            <Nav.Link style={styles.nav_link} className='pt-0' onClick={() => props.handleEditProduct(element)}>Edit</Nav.Link>
                                            <Nav.Link style={styles.nav_link} className='pt-0 delete' onClick={() => props.handleShowConfirmModal(element)}>Delete</Nav.Link>
                                        </div>
                                    </td>
                                    <td align="center" >{element.name}</td>
                                    <td align="center" >
                                        {element.price}
                                    </td>
                                    <td align="center" >
                                        {element.stock}
                                    </td>
                                    <td align="center" >
                                        {element.category && element.category.label}
                                    </td>
                                    <td align="center" >
                                        {element.sub_category && element.sub_category.label}
                                    </td>
                                    <td align="center" >
                                        {element.entry_date.substring(0, 10)}
                                    </td>
                                </tr>
                                :
                                null
                            :
                            null
                    )}
                </tbody>
            </Table >
            <style type="text/css">{`
                .admin_product_table .delete{
                    color: #ff4d4d;
                }
                .admin_product_table .delete:hover{
                    color: #e60000;
                }
                .vendor_inventory .form-control:disabled {
                    background: none;
                    font-size: 14px;
                }
            `}</style>
            <style jsx >
                {`
                .td {
                    display: flex;
                    flex-direction: row;
                    font-size: 12px;
                    float: right;
                    padding: 0%;
                    margin: 0%;
                }
                td {
                    font-size: 12px;
                }
            `}
            </style>
        </div>
    )
}

const ViewProduct = props => {
    const [ref, { x, y, width }] = useDimensions();
    const { isUpdate, data } = props;
    const [productData, setProductData] = useState({
        vendor_id: '',
        categoryId: '',
        subCategoryId: '',
        name: '',
        product_weight: '',
        handlingFee: '',
        description: '',
        brand: '',
        price: '',
        purchaseNote: '',
        stock: '',
        warranty: '',
        warrantyType: '',
        discount: '',
        sku: '',
        shippingCharges: '',
        imagesUrl: [],
        specifications: [],
        entry_date: '',
    });
    useEffect(() => {
        setProductData(data);
        return () => {
        }
    }, []);

    const [imgPreview, setImgPreview] = React.useState(false);
    const [currentImgIndex, setCurrentImgIndex] = React.useState('')
    const [imgData, setImgData] = React.useState([])

    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    // alert stack
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [alertType, setAlertType] = useState('');

    function prevImage() {
        if (currentImgIndex > 0) {
            setCurrentImgIndex(currentImgIndex - 1)
        }
    }
    function nextImage() {
        if (currentImgIndex < (imgData && imgData.length - 1)) {
            setCurrentImgIndex(currentImgIndex + 1)
        }
    }

    // Error Handling
    const [nameError, setNameError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [stockError, setStockError] = useState('');
    const [discountError, setDiscountError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [shippingChargesError, setShippingChargesError] = useState('');
    const [handlingFeeError, setHandlingFeeError] = useState('');

    const update = () => {
        if ((productData.name === '' || (productData.name && productData.name.length < 2) || (productData.name && productData.name.length > 200)) ||
            (productData.price === '' || productData.price < 0 || productData.price > 1000000) ||
            (productData.stock === '' || productData.stock < 0 || productData.stock > 10000) ||
            (productData.discount < 0 || productData.discount > 99) ||
            (productData.description && productData.description.length > 100000) ||
            (productData.shippingCharges < 0 || productData.shippingCharges > 10000) ||
            (productData.handlingFee < 0 || productData.handlingFee > 10000)
        ) {
            if ((productData.name === '' || (productData.name && productData.name.length < 2) || (productData.name && productData.name.length > 200))) {
                setNameError('Value must be 2-200 characters');
            } else {
                setNameError('');
            }

            if ((productData.price === '' || productData.price < 0 || productData.price > 1000000)) {
                setPriceError('Value must be 0-1000000');
            } else {
                setPriceError('');
            }

            if ((productData.stock === '' || productData.stock < 0 || productData.stock > 10000)) {
                setStockError('Value must be 0-10000');
            } else {
                setStockError('');
            }

            if ((productData.discount < 0 || productData.discount > 99)) {
                setDiscountError('Value must be 0-99');
            } else {
                setDiscountError('');
            }

            if ((productData.description && productData.description.length > 100000)) {
                setDescriptionError('Value can\'t be grater than 100000 characters');
            } else {
                setDescriptionError('');
            }

            if ((productData.shippingCharges < 0 || productData.shippingCharges > 10000)) {
                setShippingChargesError('Value must be 0-10000');
            } else {
                setShippingChargesError('');
            }

            if ((productData.handlingFee < 0 || productData.handlingFee > 10000)) {
                setHandlingFeeError('Value must be 0-10000');
            } else {
                setHandlingFeeError('');
            }

            setAlertMsg('Please provide correct data first!');
            setAlertType('error');
            setShowAlert(true);
        } else {
            props.setShowUpdateConfirmModal(true);
        }
    }

    return (
        <div className='admin_view_product'>
            <AlertModal
                onHide={() => setShowAlert(false)}
                show={showAlert}
                alerttype={alertType}
                message={alertMsg}
            />
            <ConfirmModal
                onHide={() => setShowDeleteConfirmModal(false)}
                show={showDeleteConfirmModal}
                iconname={faTrash}
                color={'red'}
                title={'Delete Product?'}
                _id={data._id}
                name={data.name}
                confirm={props.handleDeleteProduct}
                loading={props.deleteLoading}
            />
            <ConfirmModal
                onHide={() => props.setShowUpdateConfirmModal(false)}
                show={props.showUpdateConfirmModal}
                iconname={faEdit}
                color={'green'}
                title={'Update Product?'}
                _id={data._id}
                name={data.name}
                confirm={() => props.handleUpdateProduct(productData)}
                loading={props.updateLoading}
            />
            <TitleRow icon={faPlus} title={` Vendor Dashboard / All Products / ${productData.name}`} />
            <Form.Row style={{ margin: ' 1% 2%', display: 'flex', alignItems: 'center' }} >
                <Button variant='outline-primary' size='sm' className="mr-auto" onClick={props.back}>Back</Button>
                <div className="mr-auto" style={{ fontSize: '14px' }}> {productData.name || '-'}</div>
                {isUpdate ?
                    <>
                        <Button variant='outline-primary' size='sm' className="mr-3" onClick={() => { props.cancel(), setProductData(data) }}>Cancel</Button>
                        <Button variant='outline-primary' size='sm' className="mr-3" onClick={() => update()}>Confirm Update</Button>
                    </>
                    :
                    <Button variant='outline-primary' size='sm' className="mr-3" onClick={props.edit}>Edit</Button>
                }
                <Button variant='outline-danger' size='sm' onClick={() => setShowDeleteConfirmModal(true)}>Delete</Button>
            </Form.Row>
            <CardAccordion title={'General Info'}>
                <Row>
                    {!isUpdate && data && data.stock < constants.SIZES.LESS_STOCK ?
                        <Form.Group as={Col} lg={12} md={12} sm={12} xs={12}>
                            <Alert variant='danger' style={{ textAlign: 'center' }}>{'Stock is less than 5, Please update the stock.'}</Alert>
                        </Form.Group>
                        :
                        null
                    }
                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Product ID:</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={productData._id} disabled={true} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Product Name:</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={productData.name} disabled={!isUpdate}
                                onChange={(e) => { setProductData({ ...productData, name: e.target.value }), setNameError('') }}
                            />
                        </InputGroup>
                        {isUpdate && renderError(nameError)}
                    </Form.Group>
                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>SKU:</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={productData.sku || '-'} disabled={!isUpdate}
                                onChange={(e) => setProductData({ ...productData, sku: e.target.value })}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Brand Name:</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={productData.brand || '-'} disabled={!isUpdate}
                                onChange={(e) => { setProductData({ ...productData, brand: e.target.value }) }}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Price:</Form.Label>
                        <InputGroup>
                            <Form.Control type={'number'} type="text" size="sm" value={productData.price} disabled={!isUpdate}
                                onChange={(e) => { setProductData({ ...productData, price: e.target.value }), setPriceError('') }}
                            />
                        </InputGroup>
                        {isUpdate && renderError(priceError)}
                    </Form.Group>
                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Product In Stock:</Form.Label>
                        <InputGroup>
                            <Form.Control type={'number'} type="text" size="sm" value={productData.stock} disabled={!isUpdate}
                                onChange={(e) => { setProductData({ ...productData, stock: e.target.value }), setStockError('') }}
                            />
                        </InputGroup>
                        {isUpdate && renderError(stockError)}
                    </Form.Group>
                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Warranty (month):</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={productData.warranty || 'No Warranty'} disabled={true} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Warranty Type:</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={productData.warrantyType || '-'} disabled={true} />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Discount (%):</Form.Label>
                        <InputGroup>
                            <Form.Control type={'number'} type="text" size="sm" value={productData.discount || '0%'} disabled={!isUpdate}
                                onChange={(e) => { setProductData({ ...productData, discount: e.target.value }), setDiscountError('') }}
                            />
                        </InputGroup>
                        {isUpdate && renderError(discountError)}
                    </Form.Group>

                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Purchase Note(s):</Form.Label>
                        <InputGroup>
                            <Form.Control type="text" size="sm" value={productData.purchaseNote || '-'} disabled={!isUpdate}
                                onChange={(e) => setProductData({ ...productData, purchaseNote: e.target.value })}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group as={Col} lg={12} md={12} sm={12} xs={12}>
                        <Form.Label className='form_label'>Description:</Form.Label>
                        <InputGroup>
                            <Form.Control as="textarea" row='20' value={productData.description || 'No Description'} style={{ minHeight: '200px' }} disabled={!isUpdate}
                                onChange={(e) => { setProductData({ ...productData, description: e.target.value }), setDescriptionError('') }}
                            />
                        </InputGroup>
                        {isUpdate && renderError(descriptionError)}
                    </Form.Group>
                </Row>
            </CardAccordion>
            <CardAccordion title={'Custom Fields'}>
                <Row noGutters>
                    {productData.specifications && productData.specifications.map((element, index) =>
                        <Form.Group key={index} as={Col} lg={2} md={2} sm={4} xs={12} className='pl-1 pr-1'>
                            <Form.Label className='form_label'>{element.name}</Form.Label>
                            <InputGroup>
                                <Form.Control type="text" size="sm" value={element.value} disabled={true} />
                            </InputGroup>
                        </Form.Group>
                    )}
                </Row>
            </CardAccordion>
            <CardAccordion title={'Product Images'}>
                <Row noGutters>
                    {productData.imagesUrl && productData.imagesUrl.map((img, i) =>
                        <Col key={i} lg={1} md={2} sm={3} xs={3}>
                            <div className='my_img_div'>
                                <Image ref={ref} thumbnail
                                    style={{ width: '100%', maxHeight: width + 10 || '200px', minHeight: width + 10 || '200px' }}
                                    onClick={() => { setImgPreview(true), setCurrentImgIndex(i), setImgData(productData.imagesUrl) }} src={img.imageUrl} />
                            </div>
                        </Col>
                    )}
                </Row>
            </CardAccordion>
            <CardAccordion title={'Shipping Details'}>
                <Row>
                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Shipping Charges:</Form.Label>
                        <InputGroup>
                            <Form.Control type={'number'} type="text" size="sm" value={productData.shippingCharges || '-'} disabled={!isUpdate}
                                onChange={(e) => { setProductData({ ...productData, shippingCharges: e.target.value }), setShippingChargesError('') }}
                            />
                        </InputGroup>
                        {isUpdate && renderError(shippingChargesError)}
                    </Form.Group>
                    <Form.Group as={Col} lg={4} md={4} sm={6} xs={12}>
                        <Form.Label className='form_label'>Handlink Fee:</Form.Label>
                        <InputGroup>
                            <Form.Control type={'number'} type="text" size="sm" value={productData.handlingFee || '-'} disabled={!isUpdate}
                                onChange={(e) => { setProductData({ ...productData, handlingFee: e.target.value }), setHandlingFeeError('') }}
                            />
                        </InputGroup>
                        {isUpdate && renderError(handlingFeeError)}
                    </Form.Group>
                </Row>
            </CardAccordion>
            <CardAccordion title={'Product Categories'}>
                <Form.Group>
                    <Form.Label className='heading_label'>Product Category:</Form.Label>
                    <InputGroup>
                        <Form.Label className='form_label'>
                            {productData.category && productData.category.label}
                        </Form.Label>
                    </InputGroup>
                </Form.Group >
                <hr />
                <Form.Group>
                    <Form.Label className='heading_label'>Product Category:</Form.Label>
                    <InputGroup>
                        <Form.Label className='form_label'>
                            {productData.sub_category && productData.sub_category.label}
                        </Form.Label>
                    </InputGroup>
                </Form.Group >
            </CardAccordion >

            {/* Image Preview */}
            {imgPreview && <ImagePreview
                imgData={imgData}
                index={currentImgIndex}
                prevImage={prevImage}
                nextImage={nextImage}
                setImgPreview={() => setImgPreview(false)}
            />}
            <style type="text/css">{`
                .admin_view_product .heading_label{
                    font-size: 13px;
                    font-weight: bold;
                }
                .admin_view_product .my_img_div{
                    padding: 2%;
                    cursor: pointer;
                    background: white;
                    cursor: pointer;
                }
                .admin_view_product .my_img_div:hover{
                    box-shadow: 0px 0px 10px 0.01px gray;
                    transition-timing-function: ease-in;
                    transition: 0.5s;
                    padding: 0% 2% 4% 2%;
                }
                .admin_view_product .haeder_label{
                    font-size: 13px;
                    font-weight: bold;
                    width: 100%;
                }
                .admin_view_product .accordian_toggle{
                    background: #9a9db1;
                    font-size: 12px;
                    color: white;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                }
                .admin_view_product .accordian_toggle:hover{
                    background: #7d819b;
                }
                .admin_view_product .field_col{
                    padding: 0% 2%;
                }
                
            `}</style>
        </div>
    )
}

function ImagePreview(props) {
    const [ref, { x, y, width }] = useDimensions();
    return (
        <div className='admin_img_preview'>
            <div className="modal-overlay">
                <div className="modal-body">
                    <div className="close-modal">
                        <div className="mr-auto"></div>
                        <div className="mr-auto"></div>
                        <FontAwesomeIcon className="mr-auto" icon={faChevronLeft} style={styles.img_preview_fontawesome}
                            onClick={props.prevImage} />
                        <FontAwesomeIcon className="mr-auto" icon={faChevronRight} style={styles.img_preview_fontawesome}
                            onClick={props.nextImage} />
                        <div className="mr-auto"></div>
                        <FontAwesomeIcon icon={faTimes} style={styles.img_preview_fontawesome}
                            onClick={props.setImgPreview} />
                    </div>
                    <div className="image-container">
                        <img ref={ref}
                            thumbnail
                            src={props.imgData[props.index].imageUrl}
                            style={{ width: '100%', maxHeight: width + 90, minHeight: width + 90, margin: 'auto' }}
                        />
                    </div>
                </div>
            </div>
            <style jsx>
                {`
                   .admin_img_preview .modal-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        right: 0;
                        z-index: 10;
                        width: 100%;
                        height: 100%;
                        background: rgba(21, 21, 21, 0.75);
                    }
                    .admin_img_preview .modal-body {
                        position: relative;
                        z-index: 11;
                        margin: 2.5%;
                        overflow: hidden;
                        max-width: 100%;
                        max-height: 100%;
                    }
                    .admin_img_preview .close-modal {
                        position: fixed;
                        display: flex;
                        top: 10px;
                        left: 0;
                        right: 0;
                        width: 100%;
                    }
                    .admin_img_preview .image-container {
                        margin: 2% 30%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    @media (max-width: 1299px){
                        .admin_img_preview .image-container {
                            margin: 2% 25%;
                        }
                    }
                    @media (max-width: 1199px){
                        .admin_img_preview .image-container {
                            margin: 2% 20%;
                        }
                    }
                    @media (max-width: 991px){
                        .admin_img_preview .image-container {
                            margin: 2% 15%;
                        }
                    }
                    @media (max-width: 767px){
                        .admin_img_preview .image-container {
                            margin: 2% 10%;
                        }
                    }
                    @media (max-width: 575px){
                        .admin_img_preview .image-container {
                            margin: 10% 2%;
                        }
                    }
                `}
            </style>
        </div>
    )
}

const styles = {
    label: {
        fontSize: `${consts.SIZES.LABEL}`
    },
    nav_link: {
        paddingLeft: '10px',
        paddingRight: '5px',
    },
    label: {
        fontSize: `${consts.SIZES.LABEL}`,
        color: `${consts.COLORS.SEC}`,
        marginRight: '2%'
    },
    row: {
        margin: '2%', padding: '0%'
    },
    img_preview_fontawesome: {
        cursor: 'pointer',
        color: 'white',
        fontWeight: 'lighter',
        width: '30px',
        height: '30px',
        maxHeight: '30px',
        maxWidth: '30px',
    },
    fontawesome: {
        color: `${consts.COLORS.SEC}`,
        marginRight: '10%',
        width: '17px',
        height: '17px',
        maxHeight: '17px',
        maxWidth: '17px',
    },
    general_info_label: {
        fontSize: `${consts.SIZES.LABEL}`,
        width: '100%',
        borderBottom: '1px solid gray'
    },
    field_label: {
        border: `1px solid ${consts.COLORS.SECONDARY}`,
        color: `${consts.COLORS.SEC}`,
        margin: '0%',
        width: '100%',
        padding: '2px 5px'
    },
    card: {
        width: '100%',
        border: '1px solid lightgray'
    },
    card_header: {
        alignItems: 'center',
        fontSize: `${consts.SIZES.HEADER}`,
        background: `${consts.COLORS.MUTED}`,
    },
    slider_fontawesome: {
        color: 'white',
        width: '15px',
        height: '15px',
        maxHeight: '15px',
        maxWidth: '15px',
    },
}

