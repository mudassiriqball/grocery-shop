import { Accordion, Card, Button, InputGroup, Row, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';

import consts from '../constants';
import Scanner from '../utils/scanner/scanner';

export default function CardSearchAccordion(props) {
    const [options, setOptions] = useState([]);
    const [showScanner, setShowScanner] = useState(false);

    const [searchType, setSearchType] = useState('_id');
    const [searchValue, setSearchValue] = useState(props.value);

    function onSearchValueChange(val) {
        setSearchValue(val)
        if (val == '') {
            props.handleSearch(searchType, '')
        }
    }

    function handleSearchClearBtnClick() {
        setSearchValue('')
        props.handleSearch(searchType, '')
    }

    function handleSearchBtnClick(value) {
        if (searchType === 'order_qr_id') {
            props.handleSearch('_id', value)
        } else {
            props.handleSearch(searchType, value)
        }
    }

    function handleSearchEnterPress(e) {
        var key = e.keyCode || e.which;
        if (key == 13) {
            if (searchType === 'order_qr_id') {
                props.handleSearch('_id', searchValue)
            } else {
                props.handleSearch(searchType, searchValue)
            }
        }
    }

    useEffect(() => {
        setOptions([])
        setOptions(prevPro => {
            return [...new Set([...prevPro, { value: '_id', name: 'ID' }])]
        })
        if (props.option == 'inventory') {
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'qr_id', name: 'Scan Code' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'name', name: 'Product Name' }])]
            })
        } else if (props.option == 'customer') {
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'mobile', name: 'Mobile' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'fullName', name: 'Name' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'city', name: 'City' }])]
            })

        } else if (props.option == 'delivery') {
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'mobile', name: 'Mobile' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'fullName', name: 'Name' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'city', name: 'City' }])]
            })

        } else if (props.option == 'order') {
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'order_qr_id', name: 'Scan Code' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'c_id', name: 'Cutomer ID' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'c_name', name: 'Name' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'mobile', name: 'Mobile' }])]
            })
            setOptions(prevPro => {
                return [...new Set([...prevPro, { value: 'city', name: 'City' }])]
            })
        }
    }, [props.option])

    return (
        <>
            <Accordion as={Row} defaultActiveKey="0" style={{ margin: '2%' }} noGutters >

                <Card className='p-0 m-0 w-100'>
                    <Card.Header as={Row} className='card_toggle_header'>
                        <Col lg={12} md={12} sm={12} sm={12}>
                            <Accordion.Toggle as={Card.Header} eventKey="0" className='searc_accordian_card_toggle'>
                                <Form.Label className='p-0 mr-auto'>{props.title}</Form.Label>
                                <FontAwesomeIcon icon={faSlidersH} className='search_accordian_fontawesome' />
                            </Accordion.Toggle>
                        </Col>
                        <Col className='pb-3'>
                            {showScanner && <Scanner small setScanerCode={(val) => { onSearchValueChange(val), setShowScanner(true); }} />}
                        </Col>
                        <Col lg={12} md={12} sm={12} xs={12} className='accordian_col md_padding'>
                            <Row noGutters>
                                <Col className='ml-1' lg='auto' md='auto' sm='auto' xs='auto'>
                                    <Form.Control as="select"
                                        variant="dark"
                                        size='sm'
                                        value={props.searchType}
                                        onChange={(e) => { setSearchType(e.target.value), setShowScanner((e.target.value === 'qr_id' || e.target.value === 'order_qr_id') ? true : false) }}>
                                        {options.map((element, index) =>
                                            <option value={element.value} key={index}>{element.name}</option>
                                        )}
                                    </Form.Control>
                                </Col>
                                <Col>
                                    <InputGroup>
                                        <Form.Control
                                            size='sm'
                                            type="text"
                                            placeholder="Search here"
                                            name="search"
                                            onKeyPress={(e) => handleSearchEnterPress(e)}
                                            value={searchValue}
                                            onChange={(e) => onSearchValueChange(e.target.value)}
                                        />
                                        {searchValue && <InputGroup.Append >
                                            <Button size='sm' variant='danger' onClick={() => handleSearchClearBtnClick('')}>
                                                {'Clear'}
                                            </Button>
                                        </InputGroup.Append>
                                        }
                                        <Button size='sm' variant='light' onClick={() => handleSearchBtnClick(searchValue)}>
                                            {'Search'}
                                        </Button>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Col>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0">
                        <Card.Body className='w-100'>
                            {props.children}
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            <style type="text/css">{`
                .react-datepicker-popper {
                    z-index: 3;
                }
                .date_row {
                    padding-right: 5%;
                }
                .accordian_col{
                    padding: 0%;
                    margin: 0%;
                }
                .date_col {
                    display: block;
                }
                .card_toggle_header{
                    background: ${consts.COLORS.SEC};
                    font-size: 13px;
                    color: white;
                    display: inline-flex;
                    align-items: center;
                    width: 100;
                    padding: 1%;
                    margin: 0%;
                }
                .searc_accordian_card_toggle{
                    color: #d4d5de;
                    padding: 1% 0%;
                    margin: 0%;
                    border: none;
                    align-self: center;
                    background: ${consts.COLORS.SEC};
                    font-size: 13px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    width: 100%
                }
                .searc_accordian_card_toggle:hover{
                    color: white;
                }
                .search_accordian_fontawesome{
                    min-width: 20px;
                    max-width: 20px;
                    min-height: 20px;
                    max-height: 20px;
                    margin-left: auto;
                }

                .display_in_sm_xs{
                    display: none;
                }
                .display_in_lg_md{
                    display: flex;
                    align-items: center;
                }
                @media (max-width: 767px){
                    .display_in_sm_xs{
                        display: flex;
                    }
                    .display_in_lg_md{
                        display: none;
                    }
                    .md_padding{
                        padding-top: 1%;
                    }
                }
                @media (max-width: 575px){
                    .date_row {
                        padding-left: 0%;
                    }
                    .date_col {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        white-space: nowrape;
                    }
                    .search_accordian_fontawesome{
                        min-width: 15px;
                        max-width: 15px;
                        min-height: 15px;
                        max-height: 15px;
                    }
                    .md_padding{
                        padding-top: 2%;
                    }
                }
           `}</style>
        </>
    )
}