import React, { Component } from 'react';
import Router from 'next/router'
import axios from 'axios'
import Dashboard from '../components/admin/dashboard';
import DashboardSideDrawer from '../components/admin/dashboard-side-drawer';
import consts from '../constants';
import urls from '../utils/urls/index'
import { checkTokenExpAuth, removeTokenFromStorage, getTokenFromStorage } from '../utils/services/auth';
import Loading from '../components/loading';

export async function getServerSideProps(context) {
    let sliders_list = []
    let categories_list = []
    let sub_categories_list = []

    let customers_count = 0;
    let new_customers_count = 0;
    let restricted_customers_count = 0;
    let delivery_boy_count = 0;

    await axios.get(urls.GET_REQUEST.ALL_CUSTOMER_COUNT).then((res) => {
        customers_count = res.data.customers_count
        new_customers_count = res.data.new_customers_count
        restricted_customers_count = res.data.restricted_customers_count
        delivery_boy_count = res.data.delivery_boy_count
    }).catch((error) => {
    })

    await axios.get(urls.GET_REQUEST.SLIDERS).then((res) => {
        sliders_list = res.data.data
    }).catch((error) => {
    })

    await axios.get(urls.GET_REQUEST.CATEGORIES).then((res) => {
        categories_list = res.data.category.docs
        sub_categories_list = res.data.sub_category.docs
    }).catch((error) => {
    })

    return {
        props: {
            customers_count,
            new_customers_count,
            restricted_customers_count,
            delivery_boy_count,
            sliders_list,
            categories_list,
            sub_categories_list,
        },
    }
}


const BackDrop = props => (
    <div>
        <div onClick={props.click}>
        </div>
        <style jsx>{`
             position: fixed;
             width: 100%;
             height: 100%;
             top: 0;
             left: 0;
             background: rgba(0, 0, 0, 0.3);
             z-index: 100;
        `}</style>
    </div>
)

let token = ''
class Admin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers_count: this.props.customers_count,
            new_customers_count: this.props.new_customers_count,
            restricted_customers_count: this.props.restricted_customers_count,
            delivery_boy_count: this.props.delivery_boy_count,
            sideDrawerOpen: false,
            showWrapper: true,

            // products_list: [],
            users_count: this.props.users_count,
            vendors_list: [],
            new_vendors_list: [],
            restricted_vendors_list: [],

            customers_list: [],
            restricted_customers_list: [],

            categories_list: this.props.categories_list,
            sub_categories_list: this.props.sub_categories_list,

            sliders_list: this.props.sliders_list,

            token: null,
            user: {
                _id: '', fullName: '', mobile: '', city: '',  address: '',
                email: '', status: '', role: '', wishList: '', cart: '', entry_date: ''
            }
        }
    }

    unmounted = true
    CancelToken = axios.CancelToken;
    source = this.CancelToken.source();

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
        if (role != 'admin') {
            Router.push('/')
        }
    }

    async getUser(id) {
        let currentComponent = this
        await axios.get(urls.GET_REQUEST.USER_BY_ID + id, { cancelToken: this.source.token }).then((res) => {
            if (currentComponent.unmounted) {
                currentComponent.setState({ user: res.data.data[0] })
            }
        }).catch((err) => {
            console.log('Get user error in admin:', err);
            if (axios.isCancel(err)) return
        })
    }

    componentWillUnmount() {
        this.source.cancel();
        this.unmounted = false
    }

    drawerToggleClickHandler = () => {
        this.setState(prevState => {
            return { sideDrawerOpen: !prevState.sideDrawerOpen };
        });
    };
    ShowWrapperClickHandler = () => {
        this.setState(prevState => {
            return { showWrapper: !prevState.showWrapper };
        });
    };

    backdropClickHandler = () => {
        this.setState({ sideDrawerOpen: false });
    };

    async getCategories() {
        let currentComponent = this
        await axios.get(urls.GET_REQUEST.CATEGORIES, { cancelToken: this.source.token }).then((res) => {
            if (currentComponent.unmounted) {
                currentComponent.setState({
                    categories_list: res.data.category.docs,
                    sub_categories_list: res.data.sub_category.docs
                })
            }
        }).catch((error) => {
            console.log('Caterories Fetchig Error: ', error)
        })
    }
    async reloadSlider() {
        let currentComponent = this
        await axios.get(urls.GET_REQUEST.SLIDERS, { cancelToken: this.source.token }).then(function (res) {
            if (currentComponent.unmounted) {
                currentComponent.setState({
                    sliders_list: res.data.data,
                })
            }
        }).catch(function (error) {
            console.log('reload slider error:', error)
        })
    }

    async usersReloadCountHandler() {
        let currentComponent = this
        await axios.get(urls.GET_REQUEST.ALL_CUSTOMER_COUNT).then((res) => {
            if (currentComponent.unmounted) {
                currentComponent.setState({
                    customers_count: res.data.customers_count,
                    new_customers_count: res.data.new_customers_count,
                    restricted_customers_count: res.data.restricted_customers_count,
                    delivery_boy_count: res.data.delivery_boy_count,
                })
            }
        }).catch((error) => {
        })
    }

    async logout() {
        if (await removeTokenFromStorage()) {
            Router.replace('/')
        }
    }

    render() {
        let backdrop;
        if (this.state.sideDrawerOpen) {
            backdrop = <BackDrop click={this.backdropClickHandler} />;
        }
        if (this.state.user.role !== 'admin') {
            return <Loading />
        }
        return (
            <div style={styles.body}>
                <Dashboard
                    user={this.state.user}
                    fullName={this.state.user.fullName}
                    avatar={this.state.user.avatar}

                    customers_count={this.state.customers_count}
                    new_customers_count={this.state.new_customers_count}
                    restricted_customers_count={this.state.restricted_customers_count}
                    delivery_boy_count={this.state.delivery_boy_count}
                    usersReloadCountHandler={this.usersReloadCountHandler.bind(this)}

                    categories_list={this.state.categories_list}
                    sub_categories_list={this.state.sub_categories_list}
                    categoriesReloadHandler={this.getCategories.bind(this)}

                    sliders_list={this.state.sliders_list}
                    sliderReloadHandler={this.reloadSlider.bind(this)}

                    token={this.state.token}
                    user_name={this.state.user.fullName}
                    show={this.state.showWrapper}
                    drawerClickHandler={this.drawerToggleClickHandler}
                    wrapperBtnClickHandler={this.ShowWrapperClickHandler}
                    logout={this.logout.bind(this)}
                />
                <DashboardSideDrawer
                    user={this.state.user}
                    fullName={this.state.user.fullName}
                    avatar={this.state.user.avatar}

                    customers_count={this.state.customers_count}
                    new_customers_count={this.state.new_customers_count}
                    restricted_customers_count={this.state.restricted_customers_count}
                    delivery_boy_count={this.state.delivery_boy_count}
                    usersReloadCountHandler={this.usersReloadCountHandler.bind(this)}

                    categories_list={this.state.categories_list}
                    sub_categories_list={this.state.sub_categories_list}
                    categoriesReloadHandler={this.getCategories.bind(this)}

                    sliders_list={this.state.sliders_list}
                    sliderReloadHandler={this.reloadSlider.bind(this)}

                    token={this.state.token}
                    user_name={this.state.user.fullName}
                    show={this.state.sideDrawerOpen}
                    click={this.backdropClickHandler}
                    logout={this.logout.bind(this)}
                />
                {backdrop}
                {/* </AdminLayout> */}
                <style jsx global>{`
                    html,
                    body {
                        padding: 0;
                        margin: 0;
                        font-family: Roboto, Helvetica Neue-Light, Helvetica Neue Light, Helvetica Neue, Helvetica, Arial, Lucida Grande, sans-serif;
                    }
                `}</style>
            </div>
        );
    }
}

const styles = {
    body: {
        background: `${consts.COLORS.SECONDARY}`,
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        minHeight: '100vh',
    },
}

export default Admin;