import baseUrl from './baseUrl'

export default {
    // USERS
    VARIFY_MOBILE_NUMBER: baseUrl + '/api/users/auth/verify/mobile-number/',
    USER_BY_ID: baseUrl + '/api/users/get-user/id/user-by-id/',

    USERS_BY_STATUS: baseUrl + '/api/users/all-users/page/limit/by-status/',
    USERS_SEARCH_BY_STATUS: baseUrl + '/api/users/all-users/search/by-status/',
    WISHLIST: baseUrl + '/api/',

    // CATEGORIES
    CATEGORIES: baseUrl + '/api/categories/get-all/categories-subcategories',
    ADD_NEW_CATEGORY: baseUrl + '/api/',

    ALL_CUSTOMER_COUNT: baseUrl + '/api/users/all/user/count',
    ALL_ORDERS_COUNT: baseUrl + '/api/orders/all-orders-count',

    // PRODUCTS
    GET_PRODUCT_BY_ID: baseUrl + '/api/products/product/id/product-by-id/',
    ALL_PRODUCTS: baseUrl + '/api/products/all-products',
    PRODUCTS_BY_CATEGORY_SUB_CATEGORY_PAGE_LIMIT: baseUrl + '/api/products/page/limit/category/sub-category',
    SEARCH_PRODUCTS: baseUrl + '/api/products/search/products/query-only',
    INVENTRY_PAGE_LIMIT: baseUrl + '/api/products/inventory/page/limit/all/products',
    INVENTRY_SEARCH: baseUrl + '/api/products/inventory/admin/search/all/products',
    SLIDERS: baseUrl + '/api/sliders/all/sliders-list',
    HOME_CATEGORIES: baseUrl + '/api/categories/home-categories',
    USER_PAGE_LIMIT: baseUrl + '/api/users/',
    USERS_QUERY_SEARCH: baseUrl + '/api/users/getUsersBySearching/',
    INVENTRY_QUERY_SEARCH: baseUrl + '/api/products/admin-products-query-search',

    // ORDERS
    CUSTOMER_ALL_ORDERS_COUNT: baseUrl + '/api/orders/abc/abc/customer-orders-count/',
    ALL_ORDERS_PAGE_LIMIT_BY_STATUS: baseUrl + '/api/orders/admin/all/page/limit/orders/',
    ALL_ORDERS_SEARCH_BY_STATUS: baseUrl + '/api/orders/admin/all/search/query/page/limit/',
    CUSTOMERS_ORDERS_BY_STATUS: baseUrl + '/api/orders/customer/page/limit/orders/by-status/',
    DELIVERY_BOY_ORDERS: baseUrl + '/api/orders/delivery/boy/page/limit/orders/by-status/',
}
