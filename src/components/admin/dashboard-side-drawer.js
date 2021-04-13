import { Nav, Tab, Col, Image } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faPersonBooth, faTachometerAlt, faChevronRight, faUsers, faChevronUp, faChevronDown,
    faWarehouse, faPlusCircle, faTh, faPowerOff, faImages
} from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { MdRemoveShoppingCart } from 'react-icons/md';

// import AdminDashboard from './dashboard-contents/admin-dashboard';
import AddProduct from './dashboard-contents/add-product/add-new-product'

import Customers from './dashboard-contents/customers';
import Slider from './dashboard-contents/slider'
// Products

// Category
import AddCategory from './dashboard-contents/category-contents/add-category';
import AllCategories from './dashboard-contents/category-contents/all-categories';

import Inventory from './dashboard-contents/inventory';
import Orders from './dashboard-contents/orders'
import consts from '../../constants';
import OutOfStock from "./dashboard-contents/out-of-stock";

const DashboardSideDrawer = props => {
    let drawerClasses = "tabs_side_drawer";
    if (props.show) {
        drawerClasses = "tabs_side_drawer open";
    }

    const [show_category, setShow_category] = React.useState(false);

    return (
        <div>
            <Tab.Container id="dashboard-tabs" defaultActiveKey="Customers">
                {/* Side Drawer Components */}
                <div className={drawerClasses}>
                    <Nav className="flex-column" variant="pills">
                        {/* Links */}
                        <Nav.Item style={styles.image_div}>
                            <p>
                                <Image src={props.avatar} roundedCircle thumbnail fluid style={styles.image} />
                                <Nav.Link style={styles.nav_link}> {props.fullName} </Nav.Link>
                            </p>
                        </Nav.Item>
                        <Nav.Item>
                            <div className="nav_link">
                                <Nav.Link eventKey="Customers" onClick={props.click} style={styles.nav_link}>
                                    <FontAwesomeIcon size="xs" icon={faUsers} style={styles.fontawesome} />
                                    <div className="mr-auto">Customers</div>
                                    <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                </Nav.Link>
                            </div>
                        </Nav.Item>
                        <Nav.Item>
                            <div className="nav_link">
                                <Nav.Link eventKey="Inventory" onClick={props.click} style={styles.nav_link}>
                                    <FontAwesomeIcon icon={faWarehouse} style={styles.fontawesome} />
                                    <div className="mr-auto">Inventory</div>
                                    <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                </Nav.Link>
                            </div>
                        </Nav.Item>
                        <Nav.Item>
                            <div className="nav_link">
                                <Nav.Link eventKey="OutOfStock" onClick={props.click} style={styles.nav_link}>
                                    <MdRemoveShoppingCart style={styles.fontawesome} />
                                    <div className="mr-auto">Out Of Stock</div>
                                    <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                </Nav.Link>
                            </div>
                        </Nav.Item>
                        <Nav.Item>
                            <div className="nav_link">
                                <Nav.Link eventKey="AddProduct" onClick={props.click} style={styles.nav_link}>
                                    <FontAwesomeIcon size="xs" icon={faPlusCircle} style={styles.fontawesome} />
                                    <div className="mr-auto">Add Product</div>
                                    <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                </Nav.Link>
                            </div>
                        </Nav.Item>
                        <Nav.Item>
                            <div className="nav_link">
                                <Nav.Link eventKey="Orders" onClick={props.click} style={styles.nav_link}>
                                    <FontAwesomeIcon icon={faEdit} style={styles.fontawesome} />
                                    <div className="mr-auto">Orders</div>
                                    <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                </Nav.Link>
                            </div>
                        </Nav.Item>
                        <Nav.Item>
                            <div className="nav_link">
                                <Nav.Link eventKey="Slider" onClick={props.click} style={styles.nav_link}>
                                    <FontAwesomeIcon icon={faImages} style={styles.fontawesome} />
                                    <div className="mr-auto">Slider</div>
                                    <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                </Nav.Link>
                            </div>
                        </Nav.Item>
                        <Nav.Item>
                            <div className="nav_link">
                                <Nav.Link style={styles.nav_link} onClick={() => setShow_category(!show_category)}>
                                    <FontAwesomeIcon size="xs" icon={faTh} style={styles.fontawesome} />
                                    <div className="mr-auto"> Category </div>
                                    <FontAwesomeIcon icon={show_category ? faChevronUp : faChevronDown} style={styles.forword_fontawesome} />
                                </Nav.Link>
                            </div>
                        </Nav.Item>
                        {show_category ?
                            <div>
                                <div className="product_submenu">
                                    <Nav.Link eventKey="AddCategory" onClick={props.click} style={styles.categories_submenu_link} >
                                        <FontAwesomeIcon size="xs" icon={faPlusCircle} style={styles.fontawesome} />
                                        <div className="mr-auto"> Add Category</div>
                                        <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                    </Nav.Link>
                                </div>
                                <div className="product_submenu">
                                    <Nav.Link eventKey="AllCategories" onClick={props.click} style={styles.categories_submenu_link} >
                                        <FontAwesomeIcon size="xs" icon={faTh} style={styles.fontawesome} />
                                        <div className="mr-auto"> All Categories</div>
                                        <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                    </Nav.Link>
                                </div>
                            </div>
                            : null
                        }
                        <Nav.Item>
                            <div className="nav_link" >
                                <Nav.Link onClick={props.click, props.logout} style={styles.nav_link}>
                                    <FontAwesomeIcon icon={faPowerOff} style={styles.fontawesome} />
                                    <div className="mr-auto">Logout</div>
                                    <FontAwesomeIcon icon={faChevronRight} style={styles.forword_fontawesome} />
                                </Nav.Link>
                            </div>
                        </Nav.Item>
                    </Nav>
                </div>

                <div className="tabs_side_drawer_tab_content" >
                    <Col sm={"auto"} style={{ padding: '0px' }}>
                        <Tab.Content>
                            <Tab.Pane eventKey="Customers">
                                <Customers {...props} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="Inventory">
                                <Inventory {...props} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="OutOfStock">
                                <OutOfStock {...props} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="AddProduct">
                                <AddProduct {...props} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="Orders">
                                <Orders {...props} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="AddCategory">
                                <AddCategory {...props} />
                            </Tab.Pane>
                            <Tab.Pane eventKey="AllCategories">
                                <AllCategories
                                    {...props}
                                />
                            </Tab.Pane>
                            <Tab.Pane eventKey="Slider">
                                <Slider {...props} />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </div>
                {/* End of the Side Drawer Components */}
            </Tab.Container>
            <style jsx>
                {`
                     .show_category {
                        display: none;
                    }
                    .show_category.open {
                        display: flex;
                    }

                    .nav_link {
                        color: ${consts.COLORS.SECONDARY};
                        // border-top: 0.5px solid #434556;
                        // border-bottom: 0.5px solid #434556;
                    }
                    .nav_link:hover {
                        background: #30313E;
                    }
                    .tabs_side_drawer {
                        height: 100%;
                        background: ${consts.COLORS.SEC};
                        box-shadow: 1px 0px 7px rgba(0, 0, 0, 0.5);
                        position: fixed;
                        top: 0;
                        bottom: 1px;
                        left: 0;
                        overflow-y: auto;                        
                        width: 80%;
                        max-width: 400px;
                        z-index: 200;
                        transform: translateX(-150% );
                        transition: transform 0.5s ease-out;
                    }
                    .tabs_side_drawer.open{
                        transform: translateX(0);
                    }
                    .product_submenu {
                        background: ${consts.COLORS.SEC};
                        // border-top: 0.5px solid #434556;
                        // border-bottom: 0.5px solid #434556;
                        margin: 0% 0% 0% 6%;
                    }
                    p {
                        text-align: center; 
                        margin: 0px;
                        padding: 0px;
                    }
                    label {
                        margin-top: 4%;
                        color: ${consts.COLORS.SECONDARY};
                    }
                    
                    @media (min-width: 992px) {
                        .tabs_side_drawer {
                            display: none;
                        }
                        .tabs_side_drawer_tab_content {
                            display: none;
                        }
                    }
                `}
            </style>
        </div>
    );
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
        color: `${consts.COLORS.SEC}`,
        fontSize: '14px',
        margin: '0%',
        padding: '1%',
        border: 'none',
        cursor: 'default',
        background: 'none'
    },
    nav_link: {
        color: 'white',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        height: '60px'
    },
    categories_submenu_link: {
        color: 'white',
        fontSize: '11px',
        display: 'flex',
        alignItems: 'center',
        height: '55px'
    },
    fontawesome: {
        color: `${consts.COLORS.SECONDARY}`,
        marginRight: '8%',
        width: '17px',
        height: '17px',
        maxHeight: '17px',
        maxWidth: '17px',
    },
    forword_fontawesome: {
        color: `${consts.COLORS.SECONDARY}`,
        float: 'right',
        width: '8px',
        height: '8px',
        maxHeight: '8px',
        maxWidth: '8px',
    },
}

export default DashboardSideDrawer;