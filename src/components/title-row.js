import { Row } from 'react-bootstrap';
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const TitleRow = props => (
    <div className='_title'>
        <Row className='title_row' noGutters>
            <FontAwesomeIcon icon={props.icon} className='title_fontawesome' />
            <div className="mr-auto" > Grocery Shop / {props.title} </div>
            <Link href="/"><a>Home</a></Link>
        </Row>
        <style type="text/css">{`
            ._title .title_row{
                color: gray;
                font-size: 14px;
                border-bottom: 1px solid lightgray;
                padding: 1% 2.5%;
                display: flex;
                align-items: center;
            }

            ._title .title_fontawesome{
                color: gray;
                margin-right: 2%;
                min-width: 22px;
                min-height: 22px;
                max-height: 22px;
                max-width: 22px;
            }
            @media (max-width: 575px){
                ._title .title_row{
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                }

                ._title .title_fontawesome{
                    margin-right: 2%;
                    min-width: 18px;
                    min-height: 18px;
                    max-height: 18px;
                    max-width: 18px;
                }
            }
        `}</style>
    </div>
)
export default TitleRow;