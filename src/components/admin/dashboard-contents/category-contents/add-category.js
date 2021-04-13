import React, { Component } from 'react';
import axios from 'axios'
import { Form, Col, InputGroup, Button, Spinner } from 'react-bootstrap'
import { faListAlt } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons'

import urls from '../../../../utils/urls'
import consts from '../../../../constants'

import AlertModal from '../../../alert-modal';
import TitleRow from '../../../title-row';
import CardAccordion from '../../../card-accordion';

import { Formik } from 'formik';
import * as yup from 'yup';
import CreatableSelect from 'react-select/creatable';

const schema = yup.object({
    sub_category: yup.string()
});

class AddCategory extends Component {
    state = {
        token: this.props.token,
        isLoading: false,
        showToast: false,

        categories_list: this.props.categories_list,
        sub_categories_list: this.props.sub_categories_list,

        category: '',
        subCategory: '',
        isCategoryNew: false,
        categoryError: '',
        subCategoryError: '',
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            token: nextProps.token,
            categories_list: nextProps.categories_list,
            sub_categories_list: nextProps.sub_categories_list
        });
    }

    handleCategoryChange = (e) => {
        this.setState({ categoryError: '' })
        let search = null
        if (e != null) {
            search = this.props.categories_list.filter(element => element._id == e._id)
            if (search.length == 0) {
                this.setState({ category: e, isCategoryNew: true })
            } else {
                this.setState({ category: e, isCategoryNew: false })
            }
        } else {
            this.setState({ category: '' })
        }
    }

    handleSubCategoryChange = (e) => {
        this.setState({ subCategoryError: '' })
        let search = null
        if (e != null) {
            search = this.state.sub_categories_list.filter(element => element.value == e.value)
            if (search.length != 0) {
                this.setState({ isSubCategoryNew: true, subCategoryError: 'Enter new Value' })
            } else {
                this.setState({ subCategory: e, isSubCategoryNew: false })
            }
        } else {
            this.setState({ subCategory: '' })
        }
    }

    render() {
        return (
            <Formik
                validationSchema={schema}
                initialValues={{ sub_category: '' }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    if (this.state.category == '' || this.state.subCategory == '') {
                        if (this.state.category == '') {
                            this.setState({ categoryError: 'Select/Enter Value' })
                        }
                        if (this.state.subCategory == '') {
                            this.setState({ subCategoryError: 'Enter Value' })
                        }
                    } else if (this.state.isSubCategoryNew == true) {
                        this.setState({ subCategoryError: 'Enter New Value' })
                    } else if (this.state.category.value.length < 3 || this.state.category.value.length > 24) {
                        this.setState({
                            categoryError: 'Must be 3-25 caracters'
                        })
                    } else if (this.state.subCategory.value.length < 3 || this.state.subCategory.value.length > 24) {
                        this.setState({
                            subCategoryError: 'Must be 3-25 caracters'
                        })
                    } else {
                        const currentComponent = this;
                        this.setState({ isLoading: true });
                        axios.post(urls.POST_REQUEST.ADD_CATEGORY, {
                            category: currentComponent.state.category.value,
                            sub_category: currentComponent.state.subCategory.value,
                        }, {
                            headers: {
                                'authorization': currentComponent.state.token,
                            }
                        }).then(function (res) {
                            currentComponent.setState({
                                isLoading: false,
                                showToast: true,
                                isCategoryNew: false,
                                isSubCategoryNew: false,
                                category: '',
                                subCategory: '',
                            })
                            currentComponent.props.categoriesReloadHandler();
                        }).catch(function (error) {
                            console.log('Add category err:', error)
                            currentComponent.setState({ isLoading: false });
                            alert('Add Category Failed!\nPlease try again.');
                        });
                    }
                }}
            >
                {
                    ({
                        handleSubmit,
                        handleChange,
                        values,
                        touched,
                        isValid,
                        errors,
                        handleBlur,
                        isSubmitting
                    }) => (
                        <div className='add_category'>
                            <AlertModal
                                onHide={(e) => this.setState({ showToast: false })}
                                show={this.state.showToast}
                                alerttype={'success'}
                                message={'Category Added Successfully'}
                            />
                            <TitleRow icon={faListAlt} title={' Admin Dashboard / Add Category'} />
                            <CardAccordion title={'Add New Category'}>
                                <Form.Row>
                                    <Form.Group as={Col} lg={6} md={6} sm={6} xs={12}>
                                        <Form.Label style={styles.label}> Category <span> * </span></Form.Label>
                                        <CreatableSelect
                                            id={'1'}
                                            instanceId={'1'}
                                            inputId={'1'}
                                            isClearable
                                            value={this.state.category}
                                            onChange={this.handleCategoryChange}
                                            options={this.state.categories_list}
                                        />
                                        <Form.Row style={{ color: `${consts.COLORS.ERROR}`, fontSize: '13px', marginLeft: '2px' }}>
                                            {this.state.categoryError}
                                        </Form.Row>
                                    </Form.Group>

                                    <Form.Group as={Col} lg={6} md={6} sm={6} xs={12}>
                                        <Form.Label style={styles.label}> Sub Category <span> * </span></Form.Label>
                                        <CreatableSelect
                                            id={'1'}
                                            instanceId={'1'}
                                            inputId={'1'}
                                            isClearable
                                            value={this.state.subCategory}
                                            onChange={this.handleSubCategoryChange}
                                            options={this.state.sub_categories_list}
                                        />
                                        <Form.Row style={{ color: `${consts.COLORS.ERROR}`, fontSize: '13px', marginLeft: '2px' }}>
                                            {this.state.subCategoryError}
                                        </Form.Row>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Button type="submit"
                                            onClick={handleSubmit}
                                            disabled={this.state.isLoading} block className='mt-5'>
                                            {this.state.isLoading ? 'Uploading' : 'Add Category'}
                                            {this.state.isLoading ? <Spinner animation="grow" size="sm" /> : null}
                                        </Button>
                                    </Form.Group>
                                </Form.Row>
                            </CardAccordion>

                            <style type="text/css">{`
                                    .add_category .card-body{
                                        height: 50vh;
                                    }
                                `}</style>
                            <style jsx>{`
                                    .add_category p{
                                        font-size: 13px;
                                        text-align: center;
                                        align-self: center;
                                        width: 100%;
                                        margin-top: 5px;
                                    }
                                    .add_category span{
                                        color: red;
                                    }
                                `}</style>
                        </div >
                    )
                }
            </Formik>
        );
    }
}

export default AddCategory;

const styles = {
    label: {
        fontSize: `${consts.SIZES.LABEL}`
    },
}