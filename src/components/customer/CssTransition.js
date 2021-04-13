import { HiOutlineLocationMarker, HiOutlineMailOpen } from 'react-icons/hi';
import { AiOutlinePhone, AiFillTwitterCircle, AiFillInstagram, AiOutlineClose } from 'react-icons/ai';
import { FaFacebook } from 'react-icons/fa';
import { Card } from 'react-bootstrap';
import { CSSTransition } from 'react-transition-group';
import consts from '../../constants';

const CssTransition = props => {
    return (
        <div className='dotViewDiv'>
            <CSSTransition
                in={props.show}
                timeout={100}
                classNames="my-node"
                unmountOnExit
            >
                <div className='dots_view'>
                    <Card style={{ width: '100%', height: '100%', border: 'none' }}>
                        <AiOutlineClose onClick={props.hide} style={{ color: `${consts.COLORS.MUTED}`, fontSize: '30px', marginLeft: 'auto', marginTop: '30px', marginBlock: '10px', marginRight: '10px', cursor: 'pointer' }} />
                        <Card.Img variant="top" src="logo.png" style={{ width: '80%', alignSelf: 'center' }} />
                        <div style={{ marginTop: 'auto', padding: '8%' }}>
                            <Card.Title style={{ fontWeight: 'bolder' }}>Contact Us</Card.Title>
                            <div className='flex-row align-items-center mt-2'>
                                <HiOutlineLocationMarker style={styles.dotsIcon} />
                                <label className='dotViewLabel'>XYZ</label>
                            </div>
                            <div className='flex-row align-items-center  mt-2'>
                                <AiOutlinePhone style={styles.dotsIcon} />
                                <label className='dotViewLabel'>+92 310 1234567</label>
                            </div>
                            <div className='flex-row align-items-center  mt-2'>
                                <HiOutlineMailOpen style={styles.dotsIcon} />
                                <label className='dotViewLabel'>grocery-shop@gmail.com</label>
                            </div>
                        </div>
                        <div className='flex-row d-flex justify-content-center align-items-center' style={{ background: `${consts.COLORS.MAIN}` }}>
                            <div className='dotViewIcon'>
                                <FaFacebook style={styles.dotsSocialIconFB} />
                            </div>
                            <div className='dotViewIcon'>
                                <AiFillTwitterCircle style={styles.dotsSocialIcon} />
                            </div>
                            <div className='dotViewIcon'>
                                <AiFillInstagram style={styles.dotsSocialIcon} />
                            </div>
                        </div>
                    </Card>
                </div>
            </CSSTransition>
            <style jsx>{`
                .dotViewDiv {
                    // position: fie
                }
                .dotViewDiv .signupSpan {
                    cursor: pointer;
                }
                .dotViewDiv .signupSpan:hover {
                    cursor: pointer;
                }
                .dotViewDiv .cart {
                    width: 60px;
                    height: 60px;
                    margin-left: 5%;
                    background: ${consts.COLORS.MAIN};
                }
                .dotViewDiv .cart:hover {
                    background: ${consts.COLORS.SEC};
                }

                // dots_view
                .dotViewDiv .dots_view {
                    transition: transform ease-out 5s;
                    box-shadow: 0px 0px 10px 0.5px #e6e6e6;
                    position: fixed;
                    width: 400px;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    z-index: 10000000;
                }
                .dotViewDiv .dotViewLabel {
                    font-size: 14;
                    font-weight: bolder;
                    color: ${consts.COLORS.TEXT};
                }
                .dotViewDiv .dotViewIcon{
                    cursor: pointer;
                    height: 100%;
                }
                .dotViewDiv .dotViewIcon:hover {
                    background: ${consts.COLORS.WHITE};
                }
                .my-node-enter {
                opacity: 0;
                }
                .my-node-enter-active {
                opacity: 1;
                transition: opacity 200ms;
                }
                .my-node-exit {
                opacity: 1;
                }
                .my-node-exit-active {
                opacity: 0;
                transition: opacity 200ms;
                }
            `}</style>
            <style jsx global>{`
                * {
                    font-family: Oswald,sans-serif;
                }
            `}</style>
        </div>
    )
}

const styles = {
    cart: {
        color: consts.COLORS.WHITE,
        fontSize: '30px',
        alignSelf: 'center'
    },
    dotsIcon: {
        color: consts.COLORS.MAIN,
        fontSize: '30px',
        alignSelf: 'center',
        marginRight: '15px',
    },
    dotsSocialIcon: {
        color: consts.COLORS.SEC,
        fontSize: '50px',
        margin: '15px',
    },
    dotsSocialIconFB: {
        color: consts.COLORS.SEC,
        fontSize: '47px',
        margin: '15px',
    }

}

export default CssTransition;