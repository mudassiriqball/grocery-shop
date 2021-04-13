
// export default AuthenticationService;
import jwt_decode from 'jwt-decode';
import Router from 'next/router';
// const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlzX2RlbGV0ZWQiOjAsIl9pZCI6IjVmZGNlZDQ3MDljMWQ4MGM3YzMwNzYyZiIsIm1vYmlsZSI6Iis5MjM0MjE1NTYwMjgiLCJmdWxsTmFtZSI6Ik11ZGFzc2lyIElxYmFsIiwiZW1haWwiOiJhZmdoYW5kYXJtYWx0b29uQGdtYWlsLmNvbSIsImNpdHkiOiJJc2xhbWFiYWQiLCJyb2xlIjoiYWRtaW4iLCJhZGRyZXNzIjoiSXNsYW1pYyBVbml2ZXJzaXR5IElzbGFtYWJhZCIsImxpY2Vuc2VObyI6IjEyMzQ1Njc4OTAiLCJlbnRyeV9kYXRlIjoiMjAyMC0xMi0xOFQxNzo1NjoyMy4wODlaIiwic3RhdHVzIjoiYXBwcm92ZWQiLCJfX3YiOjB9LCJyb2xlIjoiVXNlciIsImlhdCI6MTYwODMxNzcyNywiZXhwIjoxNjA4OTIyNTI3fQ.FR5xU7WTsU377G-9vAs0tWvk3uuaRIXlOGbst5rmfUM';

const AuthenticationService = () => (
    <div></div>
)

export async function saveTokenToStorage(token) {
    await localStorage.setItem('token', token)
}
export function getDecodedTokenFromStorage() {
    const token = localStorage.getItem('token');
    if (token) {
        const decodedToken = jwt_decode(token);
        return decodedToken.data;
    }
    return null
}

export function getTokenFromStorage() {
    return localStorage.getItem('token');
}

export async function removeTokenFromStorage() {
    try {
        await localStorage.removeItem('token')
        return true
    } catch (err) {
        return false
    }
}


export function checkTokenExpAuth() {
    const token = localStorage.getItem('token');
    if (token != null) {
        const decodedToken = jwt_decode(token);
        if (decodedToken.exp < Date.now() / 1000) {
            localStorage.removeItem('token')
            Router.push('/')
            Router.reload('/')
        } else {
            return decodedToken.data;
        }
    } else
        return;
}

export function checkAuth(current_role) {
    const token = localStorage.getItem('token');
    if (token == null) {
        if (current_role == '/login' || current_role == '/signup' || current_role == '/vendor-signup') {
            Router.replace(current_role)
        } else
            Router.replace('/')
    } else {
        const decodedToken = jwt_decode(token);
        if (decodedToken.exp < Date.now() / 1000) {
            localStorage.removeItem('token')
            Router.push('/')
        } else if (decodedToken.data.role == current_role) {
            return decodedToken.data;
        } else if (current_role == '/vendor-signup' && decodedToken.data.role == 'customer') {
            Router.replace(current_role)
        } else {
            Router.replace('/')
        }
    }
}

export default AuthenticationService;