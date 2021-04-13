// import Axios from 'axios';
// import React,{useState,useEffect} from 'react'
// import { getDecodedTokenFromStorage, getTokenFromStorage } from '../utils/services/auth';
// import urls from '../utils/urls';

// export default function PlaceOrder(props) {
//     // User
//     const [user, setUser] = useState({ _id: '', fullName: '', mobile: '', city: '',  address: '', email: '', status: '', role: '', wishList: '', cart: '', entry_date: '' })
//     const [token, setToken] = useState('');
//     useEffect(() => {
//         const getDecodedToken = async () => {
//             const decodedToken = await getDecodedTokenFromStorage();
//             if (decodedToken !== null) {
//                 setUser(decodedToken);
//                 getUser(decodedToken._id);
//                 const _token = await getTokenFromStorage();
//                 if (_token !== null)
//                     setToken(_token);
//             }
//         }
//         getDecodedToken();
//         return () => { }
//     }, []);
//     async function getUser(id) {
//         await Axios.get(urls.GET_REQUEST.USER_BY_ID + id).then((res) => {
//             setUser(res.data.data[0]);
//         }).catch((err) => {
//             console.log('Get user err in profile', err);
//         })
//     }
//     // End of User

//     return (
//         <div>

//         </div>
//     )
// }

import React from 'react'

export default function PlaceOrder() {
    return (
        <div>

        </div>
    )
}
