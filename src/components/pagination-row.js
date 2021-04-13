import { Pagination, Row } from 'react-bootstrap'
import React from 'react';

export default function PaginationRow(props) {
    return (
        <Row className='d-flex justify-content-center p-0 m-0 align-items-center'>
            <Pagination >
                <Pagination.Item onClick={() => props.setActivePageNumber(1)}>{1}</Pagination.Item>
                <Pagination.Prev
                    disabled={props.activePageNumber === 1}
                    onClick={() => props.setActivePageNumber(props.activePageNumber - 1)}>
                </Pagination.Prev>

                <Pagination.Ellipsis />
                <Pagination.Item active>{props.activePageNumber}</Pagination.Item>
                <Pagination.Ellipsis />

                <Pagination.Next
                    disabled={props.totalPages !== -1 ? props.totalPages === props.activePageNumber : props.hasMore ? false : true}
                    onClick={() => props.setActivePageNumber(props.activePageNumber + 1)}>
                </Pagination.Next>
            </Pagination>
        </Row>
    )
}