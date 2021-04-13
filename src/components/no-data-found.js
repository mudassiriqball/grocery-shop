import { Row } from 'react-bootstrap'

export default function NoDataFound() {
    return (
        <div className='w-100 d-flex  justify-content-center align-items-center p-5'>
            <h6 className='text-center w-100' style={{ color: 'gray' }}>{'No Data Found'}</h6>
        </div>
    )
}
