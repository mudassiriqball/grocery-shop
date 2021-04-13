import { Form, Row, Col, Image, InputGroup, Button, Spinner } from 'react-bootstrap'
import { faListAlt, faTrash } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons'
import React, { Component } from 'react';

import urls from '../../../../utils/urls'
import consts from '../../../../constants'

import axios from 'axios';
import AlertModal from '../../../alert-modal';
import ConfirmModal from '../../../confirm-modal'
import TitleRow from '../../../title-row';
import CardAccordion from '../../../card-accordion';

let categoryArray = [];
class AllCategories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: this.props.token,
            isLoading: false,
            showToast: false,

            showConfirmDeleteModal: false,
            delete_category_id: '',
            delete_category_name: '',
            index: '',

            categoryValue: '',
            subCategoryValue: '',

            categoryError: '',
            subCategoryError: '',

            categories_list: this.props.categories_list,
            sub_categories_list: this.props.sub_categories_list,

            editRequestedCategory: '',
            showModalMessage: '',
            showModal: false,

            searchType: 'Category',
            filterStr: '',
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            categories_list: nextProps.categories_list,
            sub_categories_list: nextProps.sub_categories_list,
            token: nextProps.token
        });
        categoryArray = nextProps.categories_list
    }

    // All categories
    handleFilterStrChange(e) {
        this.setState({ filterStr: e.target.value });
        let array = [];
        if (e.target.value != '') {
            if (this.state.searchType == 'Category') {
                categoryArray.filter(function (data) {
                    const value = data.value.toLowerCase()
                    if (value.includes(e.target.value.toLowerCase())) {
                        array.push(data);
                    }
                })
            } else {
                let currentComponent = this
                this.state.sub_categories_list.filter(function (element) {
                    const value = element.value.toLowerCase()
                    if (value.includes(e.target.value.toLowerCase())) {
                        categoryArray.filter(function (e) {
                            if (element.category_id == e._id) {
                                array.push(e)
                            }
                        })
                    }
                })
                let a = []
                array.map(x => {
                    if (!a.includes(x)) {
                        a.push(x)
                    }
                })
                array = a
            }
            this.setState({ categories_list: array })
        } else {
            this.setState({ categories_list: categoryArray })
        }
    }
    //  => Value  Chane
    handleCategoryChange = (e, index) => {
        let copyArray = [];
        copyArray = Object.assign([], this.state.categories_list);
        copyArray[index].value = e.target.value;

        if (e.target.value != '' && e.target.value.length <= 20 && e.target.value.length >= 3) {
            copyArray[index].error = ''
        } else {
            copyArray[index].error = 'Value must be 3-20 characters'
        }
        this.setState({ categories_list: copyArray })
    }
    //  => Edit
    async handleEditCategoryClick(index) {
        let copyArray = [];
        copyArray = Object.assign([], this.state.categories_list);
        var obj = {};
        obj['_id'] = copyArray[index]._id;
        obj['label'] = false;
        obj['value'] = copyArray[index].value;
        obj['prevVal'] = copyArray[index].value;
        obj['error'] = '';
        obj['isLoading'] = false;

        copyArray[index] = obj
        await this.setState({ categories_list: copyArray })
    }
    //  => Cancle
    handleCancelCategoryClick(index) {
        let copyArray = [];
        copyArray = Object.assign([], this.state.categories_list);
        copyArray[index].value = copyArray[index].prevVal;
        copyArray[index].isUpdatedImage = false;
        copyArray[index].error = '';
        copyArray[index].label = true;
        this.setState({ categories_list: copyArray })
    }
    //  => Update
    async handleUpdateCategoryClick(index) {
        let copyArray = [];
        copyArray = Object.assign([], this.state.categories_list);
        copyArray[index].isLoading = true;
        this.setState({
            categories_list: copyArray,
        });
        const currentComponent = this
        await axios.put(urls.PUT_REQUEST.UPDATE_CATEGORY + copyArray[index]._id, {
            category: copyArray[index].value,
        }, {
            headers: {
                'authorization': this.state.token,
            }
        }).then(function (response) {
            copyArray[index].label = copyArray[index].value;
            copyArray[index].prevVal = copyArray[index].value;
            copyArray[index].isLoading = false;
            currentComponent.setState({
                categories_list: copyArray,
                showModalMessage: 'Category Updated Successfully',
                showModal: true
            });
            categoryArray = copyArray
            currentComponent.props.categoriesReloadHandler()
        }).catch(function (error) {
            copyArray[index].isLoading = false;
            currentComponent.setState({
                categories_list: copyArray,
            });
            try {
                alert('Error: ', error.response.data.message);
            } catch (err) {
                alert('Category Update Failed');
                console.log('Request Failed:', error)
            }
        });
    }


    // 
    // Sub Category
    handleSubCategoryChange = (e, index) => {
        let copyArray = [];
        copyArray = Object.assign([], this.state.sub_categories_list);
        copyArray[index].value = e.target.value;

        if (e.target.value != '' && e.target.value.length <= 25 && e.target.value.length >= 5) {
            copyArray[index].error = ''
        } else {
            copyArray[index].error = 'Value must be 5-25 characters'
        }
        this.setState({ sub_categories_list: copyArray })
    }

    //  => Edit
    async handleEditSubCategoryClick(index) {
        let copyArray = [];
        copyArray = Object.assign([], this.state.sub_categories_list);
        var obj = {};
        obj['_id'] = copyArray[index]._id;
        obj['category_id'] = copyArray[index].category_id;
        obj['value'] = copyArray[index].value;
        obj['prevVal'] = copyArray[index].value;
        obj['label'] = false;

        obj['isUpdateLoading'] = false;
        obj['isDeleteLoading'] = false;
        obj['error'] = '';
        copyArray[index] = obj
        await this.setState({ sub_categories_list: copyArray })
    }
    //  => Cancle
    handleCancelSubCategoryClick(index) {
        let copyArray = [];
        copyArray = Object.assign([], this.state.sub_categories_list);
        copyArray[index].value = copyArray[index].prevVal;
        copyArray[index].error = '';
        copyArray[index].label = true;
        this.setState({ sub_categories_list: copyArray })
    }
    //  => Update
    async handleUpdateSubCategoryClick(index) {
        let copyArray = [];
        copyArray = Object.assign([], this.state.sub_categories_list);
        if (copyArray[index].value == copyArray[index].prevVal) {
            copyArray[index].error = 'Enter Different Value';
            this.setState({ sub_categories_list: copyArray });
        } else {
            copyArray[index].isUpdateLoading = true;
            this.setState({
                sub_categories_list: copyArray,
            });
            const currentComponent = this
            let data = [];
            data = {
                sub_category: copyArray[index].value,
            }
            await axios.put(urls.PUT_REQUEST.UPDATE_SUB_CATEGORY + copyArray[index]._id, data, {
                headers: { 'authorization': this.state.token }
            }).then(function (response) {
                copyArray[index].isUpdateLoading = false;
                copyArray[index].label = copyArray[index].value;
                copyArray[index].prevVal = copyArray[index].value;
                currentComponent.setState({
                    showModalMessage: 'Product Sub Category Updated Successfully',
                    showModal: true
                });
                currentComponent.props.categoriesReloadHandler();
            }).catch(function (error) {
                copyArray[index].isUpdateLoading = false;
                currentComponent.setState({
                    sub_categories_list: copyArray,
                });
                try {
                    alert('Error: ', error.response.data.message);
                } catch (err) {
                    console.log('Request Failed:', error)
                }
            });
        }
    }
    //  => Delete
    async handleDeleteSubCategoryClick() {
        this.setState({ showConfirmDeleteModal: false })
        let copyArray = [];
        let index = this.state.index
        const currentComponent = this
        copyArray = Object.assign([], this.state.sub_categories_list);
        copyArray[index].isDeleteLoading = true;
        this.setState({
            sub_categories_list: copyArray,
        });
        await axios.delete(urls.DELETE_REQUEST.DELETE_SUB_CATEGORY, {
            headers: { 'authorization': this.state.token }
        }).then(function (response) {
            copyArray.splice(index, 1);
            copyArray[index].isDeleteLoading = false;
            currentComponent.setState({
                sub_categories_list: copyArray,
                showModalMessage: 'Category Deleted Successfully',
                showModal: true
            })
            categoryArray = copyArray
        }).catch(function (error) {
            copyArray[index].isDeleteLoading = false;
            currentComponent.setState({
                sub_categories_list: copyArray,
            });
            try {
                alert('Error: ', error.response.data.message);
            } catch (err) {
                console.log('Request Failed:', error)
            }
        });
    }


    render() {
        return (
            <div className='all_categories'>
                <AlertModal
                    onHide={(e) => this.setState({ showModal: false })}
                    show={this.state.showModal}
                    alerttype={'success'}
                    message={this.state.showModalMessage}
                />
                <ConfirmModal
                    onHide={() => this.setState({ showConfirmDeleteModal: false })}
                    show={this.state.showConfirmDeleteModal}
                    iconname={faTrash}
                    color={'red'}
                    title={'Delete Sub Category'}
                    _id={this.state.delete_category_id}
                    name={this.state.delete_category_name}
                    confirm={this.handleDeleteSubCategoryClick.bind(this)}
                />
                <TitleRow icon={faListAlt} title={' Admin Dashboard / All Categories'} />
                <CardAccordion title={'All Categories'}>
                    <Form.Row style={{ margin: '0% 5%' }}>
                        <Form.Group as={Col}>
                            <InputGroup>
                                <InputGroup.Prepend >
                                    <Form.Control as="select" variant="primary" size='sm'
                                        value={this.state.searchType} onChange={(e) => this.setState({ searchType: e.target.value })}>
                                        <option>Category</option>
                                        <option>Sub Category</option>
                                    </Form.Control>
                                </InputGroup.Prepend>
                                <Form.Control
                                    type="text"
                                    size="sm"
                                    placeholder="Search Here"
                                    name="search"
                                    value={this.state.filterStr}
                                    onChange={(e) => this.handleFilterStrChange(e)}
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    <hr />
                    {this.state.categories_list && this.state.categories_list.map((element, index) =>
                        <div key={index}>
                            <Form.Row>
                                <Col>
                                    <Form.Group as={Form.Row}>
                                        <Form.Control
                                            type="text"
                                            size="sm"
                                            name="sku"
                                            value={element.value}
                                            disabled={element.label}
                                            onChange={(e) => this.handleCategoryChange(e, index)}
                                            isInvalid={element.error}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {element.error}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Row>
                                        <Form.Group as={Col} lg="auto" md="auto" sm="auto" xs="auto">
                                            <Button type="submit" className='d-inline-flex' variant={element.label ? "outline-primary" : "outline-success"} size="sm"
                                                onClick={element.label ? () => this.handleEditCategoryClick(index) : () => this.handleUpdateCategoryClick(index)}
                                                disabled={element.label ? false : element.error}
                                            >
                                                {element.label ? ' Edit ' : ' Update '}
                                                {element.label ? null : element.isLoading ? <Spinner animation="grow" size="sm" /> : null}
                                            </Button>
                                        </Form.Group>

                                        <Form.Group as={Col} lg="auto" md="auto" sm="auto" xs="auto">
                                            <Button type="submit" variant={element.label ? "outline-danger" : "outline-primary"}
                                                size="sm" block style={styles.submit_btn}
                                                onClick={element.label ? null : () => this.handleCancelCategoryClick(index)}
                                                disabled={element.label ? true : false}
                                            >
                                                {element.label ? ' Delete ' : ' Cancel '}
                                            </Button>
                                        </Form.Group>
                                    </Row>
                                </Col>
                            </Form.Row>
                            <hr className='pb-0 pt-0 mt-0' />
                            <Form.Row >
                                {this.state.sub_categories_list.map((e, i) => (element._id == e.category_id) ?
                                    <Col lg={6} md={6} sm={12} xs={12} key={e._id}>
                                        <Form.Row>
                                            <Form.Group as={Col} lg="auto" md="auto" sm={8} xs={12}>
                                                <Form.Control
                                                    type="text"
                                                    size="sm"
                                                    name="sku"
                                                    value={e.value}
                                                    disabled={e.label}
                                                    onChange={(event) => this.handleSubCategoryChange(event, i)}
                                                    isInvalid={e.error}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {e.error}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <div className='mr-auto'></div>
                                            <Form.Group as={Col} lg="auto" md="auto" sm="auto" xs="auto">
                                                <Button type="submit" className='d-inline-flex' variant={e.label ? "outline-primary" : "outline-success"} size="sm" block
                                                    onClick={e.label ? () => this.handleEditSubCategoryClick(i) : () => this.handleUpdateSubCategoryClick(i)}
                                                    disabled={e.label ? false : e.error}
                                                >
                                                    {e.label ? ' Edit ' : ' Update '}
                                                    {e.label ? null : e.isUpdateLoading ? <Spinner animation="grow" size="sm" /> : null}
                                                </Button>
                                            </Form.Group>
                                            <div className='sm_xs_show mr-auto'></div>
                                            <Form.Group as={Col} lg="auto" md="auto" sm="auto" xs="auto">
                                                <Button type="submit" className='d-inline-flex' variant={e.label ? "outline-danger" : "outline-primary"} size="sm" block
                                                    disabled={e.label ? true : false}
                                                    onClick={
                                                        e.label ?
                                                            () => this.setState({
                                                                showConfirmDeleteModal: true,
                                                                delete_category_id: e._id,
                                                                delete_category_name: e.value,
                                                                index: i
                                                            })
                                                            :
                                                            () => this.handleCancelSubCategoryClick(i)}
                                                >
                                                    {e.label ? ' Delete ' : ' Cancel '}
                                                    {e.label ? e.isDeleteLoading ? <Spinner animation="grow" size="sm" /> : null : null}
                                                </Button>
                                            </Form.Group>
                                        </Form.Row>
                                    </Col>
                                    :
                                    null
                                )}
                            </Form.Row>
                            <div className='w-100 mt-5 mb-2' style={{ background: 'lightgray', minHeight: '5px' }}></div>
                        </div>
                    )}
                </CardAccordion>
                <style jsx>
                    {`
                        @media only screen and (min-width: 768px){
                            .sm_xs_show {
                                display: none
                            }
                        }
                    `}
                </style>
            </div >
        )
    }
}

const styles = {
    label: {
        fontSize: `${consts.SIZES.LABEL}`
    },
}
export default AllCategories
