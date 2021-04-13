import React, { useState } from 'react'
import axios from 'axios'
import { Card, Form, Col, Row, Image, Button, InputGroup, Spinner } from 'react-bootstrap'
import urls from '../../utils/urls'
import constants from '../../constants'
import CustomButton from '../CustomButton'

import { BsUpload } from 'react-icons/bs';

export default function ChangrProfilePicture(props) {
    const [token, setToken] = useState(null)
    const [img, setImg] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleImgUpload() {
        let uploaded = false;
        let secure_url = '';
        setIsLoading(true);
        const data = new FormData();
        data.append('file', img);
        data.append('upload_preset', 'ml_default');
        await fetch('https://api.cloudinary.com/v1_1/daneglcza/image/upload', {
            method: 'POST',
            body: data,
        }).then(async res => {
            uploaded = true;
            let dataa = await res.json();
            secure_url = dataa.secure_url;
            setIsLoading(false);
        }).catch(err => {
            uploaded = false;
            console.log('error:', err)
            setIsLoading(false);
            alert("An Error Occured While Uploading")
            return;
        })
        if (uploaded) {
            await axios.put(urls.PUT_REQUEST.UPDATE_USER_PROFILE + props._id, { avatar: secure_url }, {
                headers: {
                    'authorization': props.token,
                }
            }).then((response) => {
                setIsLoading(false)
                setImg('')
                props.showAlert('Image Uploaded Successfully');
                props.reloadUser()
            }).catch((error) => {
                setIsLoading(false)
                alert('Error');
            });
        }
    }

    return (
        <div className='change_picture'>
            {!props.isMobile && <label className='heading'>{'Change Profile Picture'}</label>}
            <Card>
                <Card.Body className='card_body'>
                    <Form.Group as={Row} className='profile_img_col'>
                        <Image src={img != '' ? URL.createObjectURL(img) : props.avatar} roundedCircle thumbnail fluid
                            style={{ minWidth: '100px', maxWidth: '100px', minHeight: '100px', maxHeight: '100px' }} />
                    </Form.Group>
                    <hr />
                    <Form.Group as={Col}>
                        <InputGroup className='profile_img_col'>
                            <Form.File
                                size='sm'
                                className="position-relative"
                                style={{ color: 'gray' }}
                                required
                                name="file"
                                onChange={(e) => setImg(e.target.files[0])}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group as={Row} className='profile_img_col btn_row mt-5'>
                        <CustomButton
                            block
                            loading={isLoading}
                            disabled={img == '' || isLoading}
                            title={'Upload'}
                            onClick={handleImgUpload}
                        >
                            {!isLoading && <BsUpload style={{ fontSize: '20px', marginRight: '10px', color: constants.COLORS.WHITE }} />}
                        </CustomButton>
                    </Form.Group>
                </Card.Body>
            </Card>
            <style type="text/css">{`
                .change_picture .card {
                    border: none;
                    background: ${constants.COLORS.SECONDARY};
                    min-height: 200px;
                }
                .change_picture .card-header {
                    display: inline-flex;
                    align-items: center;
                    font-size: 15px;
                    font-weight: bold;
                    color: ${constants.COLORS.TEXT};
                    border: none;
                    padding-bottom: 0%;
                    background: none;
                }
                .change_picture .profile_pic_div {
                    padding: 5px;
                }
                .change_picture .heading {
                    font-size: 18px;
                    margin-top: 10px;
                    width: 100%;
                    text-align:center;
                }
                .change_picture .profile_img_col {
                    display:flex;
                    align-items: center;
                    justify-content: center;
                }
                 @media (max-width: 767px){
                    .change_picture {
                        padding: 1.5%;
                    }
                    .change_picture .profile_img_col {
                        padding: 0%;
                    }
                    .change_picture .card_body {
                        padding: 5%;
                    }
                    .btn_row {
                        margin: 0%;
                    }
                }
            `}</style>
        </div>
    )
}
