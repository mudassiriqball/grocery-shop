import Router from "next/router";
import { Image, Nav, Navbar, NavDropdown, Button, Tab, Row, Col, } from "react-bootstrap"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faBars, faPowerOff, faChevronRight, faPlusCircle, faChevronDown, faChevronUp,
    faPersonBooth, faHandsHelping, faUsers, faTachometerAlt,
    faWarehouse, faTh, faCog, faImages,
} from '@fortawesome/free-solid-svg-icons';
import { faEdit, faUserCircle } from '@fortawesome/free-regular-svg-icons'
import { MdRemoveShoppingCart } from 'react-icons/md';

import AddProduct from './dashboard-contents/add-product/add-new-product'
import Customers from './dashboard-contents/customers';
import Slider from './dashboard-contents/slider';
// Category
import AddCategory from './dashboard-contents/category-contents/add-category'
import AllCategories from './dashboard-contents/category-contents/all-categories'

import Inventory from './dashboard-contents/inventory';
import Orders from './dashboard-contents/orders'
import consts from '../../constants';
import OutOfStock from "./dashboard-contents/out-of-stock";

const Dashboard = props => {
    let wprapper_Casses = "wrapper";
    if (props.show) {
        wprapper_Casses = "wrapper open";
    }
    const [show_category, setShow_category] = React.useState(false);

    return (
        <div className='admin_dashboard'>
            <Tab.Container id="dashboard-tabs" defaultActiveKey="Customers"  >
                <Row style={{ width: '100%', margin: '0px', maxHeight: '7vh', minHeight: '7vh' }}>
                    {/* Toolbar */}
                    <Navbar collapseOnSelect expand="lg" style={styles.navbar} variant="light" className='p-2 m-0 w-100'>
                        {/* Show/Hide bar btn while screen switches to Large to Small,Medium,Extra-Small Devices */}
                        <div className="side_tab_toogle_btn mr-auto" style={styles.toolbar_btn_div}>
                            <Button style={styles.toolbar_btn} onClick={props.drawerClickHandler}>
                                <FontAwesomeIcon icon={faBars} style={styles.toolbar_fontawesomer} />
                            </Button>
                        </div>
                        {/* Bars Btn to Show/Hide Tabs Sde Drawer in Large Devices */}
                        <div className="wrapper_btn" style={styles.toolbar_btn_div}>
                            <Button style={styles.toolbar_btn} onClick={props.wrapperBtnClickHandler} className='ml-1'>
                                <FontAwesomeIcon icon={faBars} style={styles.toolbar_fontawesomer} />
                            </Button>
                        </div>
                        {/* Account Setting Dropdown */}
                        <div className="account_settig_dropdown ml-auto">
                            <NavDropdown className='nav_dropdown' title={
                                <FontAwesomeIcon icon={faCog} style={styles.cog_fontawesome} />
                            } id="nav-dropdown" alignRight>
                                <NavDropdown.Item onClick={() => Router.push('/profile')} className='profile_md_lg'>
                                    <FontAwesomeIcon icon={faUserCircle} className='dropdown_fontawesome' />
                                    {'Profile'}
                                </NavDropdown.Item>

                                <NavDropdown.Item className='dropdown_item'>
                                    <FontAwesomeIcon icon={faHandsHelping} className='dropdown_fontawesome' />
                                        Help?
                                    </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={props.logout} className='dropdown_item'>
                                    <FontAwesomeIcon icon={faPowerOff} className='dropdown_fontawesome' />
                                        Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        </div>
                    </Navbar>
                    {/* End of Toolbar */}
                </Row>
                <Row noGutters>
                    {/* Show/Hide Tabs & Tabs-Content when screen Switches to Large/Medium,Small,Extra-Small Devices*/}
                    <div className={wprapper_Casses} style={styles.wrapper_col}>
                        <Nav className="flex-column" variant="pills" style={{ minWidth: '220px', maxWidth: '220px' }}>
                            <Nav.Item style={styles.image_div}>
                                <p>
                                    <Image src={props.avatar} roundedCircle thumbnail fluid style={styles.image} />
                                    <Nav.Link style={styles.nav_link}> {props.fullName} </Nav.Link>
                                </p>
                            </Nav.Item>
                            <Nav.Item>
                                <div className="nav_link">
                                    <Nav.Link eventKey="Customers" style={styles.nav_link} onClick={() => setShow_category(false)}>
                                        <FontAwesomeIcon size="xs" icon={faUsers} style={styles.fontawesome} />
                                        <div className="mr-auto _label">Customers</div>
                                        <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                    </Nav.Link>
                                </div>
                            </Nav.Item>
                            <Nav.Item>
                                <div className="nav_link">
                                    <Nav.Link eventKey="Inventory" style={styles.nav_link} onClick={() => setShow_category(false)}>
                                        <FontAwesomeIcon icon={faWarehouse} style={styles.fontawesome} />
                                        <div className="mr-auto _label">Inventory</div>
                                        <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                    </Nav.Link>
                                </div>
                            </Nav.Item>
                            <Nav.Item>
                                <div className="nav_link">
                                    <Nav.Link eventKey="OutOfStock" style={styles.nav_link} onClick={() => setShow_category(false)}>
                                        <MdRemoveShoppingCart style={styles.fontawesome} />
                                        <div className="mr-auto _label">Out Of Stock</div>
                                        <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                    </Nav.Link>
                                </div>
                            </Nav.Item>
                            <Nav.Item>
                                <div className="nav_link">
                                    <Nav.Link eventKey="AddProduct" onClick={props.click} style={styles.nav_link}>
                                        <FontAwesomeIcon size="xs" icon={faPlusCircle} style={styles.fontawesome} />
                                        <div className="mr-auto _label">Add Product</div>
                                        <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                    </Nav.Link>
                                </div>
                            </Nav.Item>
                            <Nav.Item>
                                <div className="nav_link">
                                    <Nav.Link eventKey="Orders" style={styles.nav_link} onClick={() => setShow_category(false)}>
                                        <FontAwesomeIcon icon={faEdit} style={styles.fontawesome} />
                                        <div className="mr-auto _label">Orders</div>
                                        <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                    </Nav.Link>
                                </div>
                            </Nav.Item>
                            <Nav.Item>
                                <div className="nav_link" >
                                    <Nav.Link eventKey="Slider" style={styles.nav_link} onClick={() => setShow_category(false)}>
                                        <FontAwesomeIcon icon={faImages} style={styles.fontawesome} />
                                        <div className="mr-auto _label">Slider</div>
                                        <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                    </Nav.Link>
                                </div>
                            </Nav.Item>
                            <Nav.Item>
                                <div style={{ borderTop: '0.5px solid #434556' }}>
                                    <Nav.Link style={styles.nav_link}>
                                        <FontAwesomeIcon size="xs" icon={faTh} style={styles.fontawesome} />
                                        <div className="mr-auto _label"> Category </div>
                                    </Nav.Link>
                                </div>
                            </Nav.Item>
                            <div>
                                <div className="limk_submenue">
                                    <Nav.Link eventKey="AddCategory" style={styles.submenu_link} >
                                        <FontAwesomeIcon size="xs" icon={faPlusCircle} style={styles.fontawesome} />
                                        <div className="mr-auto _label"> Add Category</div>
                                        <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                    </Nav.Link>
                                </div>
                                <div className="limk_submenue">
                                    <Nav.Link eventKey="AllCategories" style={styles.submenu_link} >
                                        <FontAwesomeIcon size="xs" icon={faTh} style={styles.fontawesome} />
                                        <div className="mr-auto _label"> All Categories</div>
                                        <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                    </Nav.Link>
                                </div>
                            </div>
                        </Nav>
                        {/* End Tabs Side Drawer */}
                    </div>
                    {/* Toolbar & Tabs Contents */}
                    <Col>
                        {/* Tab Content for Large Devices */}
                        <div className="tab_content">
                            <Tab.Content style={{ height: `calc(100vh - 65px)`, overflowY: 'auto' }}>
                                <Tab.Pane eventKey="Customers">
                                    <Customers
                                        {...props}
                                    />
                                </Tab.Pane>
                                <Tab.Pane eventKey="Slider">
                                    <Slider {...props} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="Inventory">
                                    <Inventory {...props} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="OutOfStock">
                                    <OutOfStock {...props} />
                                </Tab.Pane>
                                <Tab.Pane eventKey="Orders">
                                    <Orders
                                        {...props}
                                    />
                                </Tab.Pane>
                                <Tab.Pane eventKey="AddProduct">
                                    <AddProduct
                                        title={'Add New Product'}
                                        {...props}
                                    />
                                </Tab.Pane>
                                <Tab.Pane eventKey="AddCategory">
                                    <AddCategory
                                        {...props}
                                    />
                                </Tab.Pane>
                                <Tab.Pane eventKey="AllCategories">
                                    <AllCategories
                                        {...props}
                                    />
                                </Tab.Pane>
                            </Tab.Content>
                        </div>
                        {/* End of Tab Content for Large Devices */}
                    </Col>
                    {/* End of the Toolbar & Tabs Components */}
                </Row>
            </Tab.Container>
            <style type="text/css">{`
                .admin_dashboard ._label {
                    font-size: 12px;
                }
                .admin_dashboard .dropdown_item{
                    color: gray;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    padding: 3% 5%;
                }
                .admin_dashboard .dropdown_item:hover{
                    background: ${consts.COLORS.ADMIN_MAIN};
                    color: white;
                }
                .admin_dashboard .search_form{
                    width: 50%;
                    padding-left: 5%;
                }

                .admin_dashboard .dropdown_fontawesome {
                    margin: 0px 10px 0px 0px;
                    min-width: 18px;
                    min-height: 18px;
                    max-height: 18px;
                    max-width: 18px;
                }
                .admin_dashboard .profile_md_lg {
                    display: flex;
                    color: gray;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    padding: 3% 5%;
                }
                .admin_dashboard .profile_md_lg:hover {
                    background: ${consts.COLORS.ADMIN_MAIN};
                    color: white;
                }
                .admin_dashboard .profile_xs_sm {
                    display: none;
                }

                @media (max-width: 991px){
                    .admin_dashboard .search_form{
                        width: 80%;
                        padding: 0%;
                    }
                }
                @media (max-width: 767px) {
                    .admin_dashboard .profile_md_lg {
                        display: none;
                    }
                    .admin_dashboard .profile_xs_sm {
                        display: flex;
                        color: gray;
                        font-size: 13px;
                        display: flex;
                        align-items: center;
                        padding: 3% 5%;
                    }
                }
                @media (max-width: 575px){
                    .admin_dashboard .search_form{
                        width: 90%;
                    }
                }
            `}</style>
            <style jsx>
                {`
                .account_settig_dropdown {
                    display: flex;
                    align-items: center;
                }
                .show_product {
                    display: none;
                }
                .show_product.open {
                    display: flex;
                }

                .show_category {
                    display: none;
                }
                .show_category.open {
                    display: flex;
                }

                .wrapper {
                    display: none;
                }
                .wrapper.open{
                    backgroung:  ${consts.COLORS.ADMIN_MAIN};
                    display: block;
                    height: 93vh;
                    overflow-y: auto;
                }
                .nav_link {
                    background: ${consts.COLORS.ADMIN_MAIN};
                    // border-top: 0.5px solid #434556;
                    // border-bottom: 0.5px solid #434556;
                    margin: 0px;
                }
                .nav_link:hover {
                    background: ${consts.COLORS.SEC_HOVER};
                }
                .limk_submenue {
                    background: ${consts.COLORS.ADMIN_MAIN};
                    // border-top: 0.5px solid #434556;
                    // border-bottom: 0.5px solid #434556;
                    margin: 0% 0% 0% 6%;
                }
                .limk_submenue:hover {
                    background: ${consts.COLORS.SEC_HOVER};
                    // background: #30313E;
                }
                .side_tab_toogle_btn {
                    margin: 0%
                }
                p {
                    text-align: center; 
                    margin: 0px;
                }
                @media (max-width: 991px) {
                    .wrapper_btn {
                        display: none
                    }
                    .wrapper {
                      display: none;
                    }
                    .tab_content {
                        display: none;
                    }
                    .wrapper.open {
                        display: none;
                        height: 0vh
                    }
                }
                @media (min-width: 992px) {
                    .side_tab_toogle_btn {
                        display: none;
                    }
                }
            `}
            </style>
        </div>
    )
}

const styles = {
    image_div: {
        background: 'white',
        width: '100%',
        borderRight: '0.5px solid gray',
        padding: '2%'
    },
    image: {
        marginTop: '5px',
        minWidth: '100px',
        maxWidth: '100px',
        minHeight: '100px',
        maxHeight: '100px',
    },
    nav_link: {
        color: `${consts.COLORS.ADMIN_MAIN}`,
        fontSize: '14px',
        margin: '0%',
        padding: '1%',
        border: 'none',
        cursor: 'default',
        background: 'none'
    },
    wrapper_col: {
        background: `${consts.COLORS.ADMIN_MAIN}`,
    },
    navbar: {
        background: consts.COLORS.ADMIN_MAIN,
        padding: '0.5% 1%',
    },
    toolbar_btn_div: {
        marginRight: '1%',
    },
    toolbar_btn: {
        background: `${consts.COLORS.ADMIN_MAIN}`,
        border: 'none',
        width: '31px',
        height: '31px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0px',
    },
    toolbar_fontawesomer: {
        color: `${consts.COLORS.WHITE}`,
        width: '25px',
        height: '25px',
        maxHeight: '25px',
        maxWidth: '25px',
    },

    search_bar: {
        flex: '1',
    },
    nav_link: {
        color: 'white',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        height: '50px'
    },
    submenu_link: {
        color: 'white',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        height: '50px'
    },

    fontawesome: {
        color: `${consts.COLORS.WHITE}`,
        marginRight: '8%',
        width: '18px',
        height: '18px',
        maxHeight: '18px',
        maxWidth: '18px',
    },
    forword_fontawesome: {
        color: `${consts.COLORS.WHITE}`,
        width: '10px',
        height: '10px',
        maxHeight: '10px',
        maxWidth: '10px',
    },

    cog_fontawesome: {
        color: `${consts.COLORS.WHITE}`,
        margin: '0px',
        width: '18px',
        height: '18px',
        maxHeight: '18px',
        maxWidth: '18px',
    }
}

export default Dashboard;