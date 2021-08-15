import React, { useState } from 'react'
import { Pagination } from 'rsuite'
import './table.css'

const Table = props => {

    const initDataShow = props.limit && props.bodyData ? props.bodyData.slice(0, Number(props.limit)) : props.bodyData

    const [dataShow, setDataShow] = useState(initDataShow)

    let pages = 1

    let range = []

    if (props.limit !== undefined) {
        let page = Math.floor(props.bodyData.length / Number(props.limit))
        pages = props.bodyData.length % Number(props.limit) === 0 ? page : page + 1
        range = [...Array(pages).keys()]
    }

    const [currPage, setCurrPage] = useState(0)

    const selectPage = page => {
        const start = Number(props.limit) * page
        const end = start + Number(props.limit)

        setDataShow(props.bodyData.slice(start, end))

        setCurrPage(page)
    }

    return (
        <div>
            <div className="table-wrapper">
                <table>
                    {
                        props.headData && props.renderHead ? (
                            <thead>
                                <tr>
                                    {
                                        props.headData.map((item, index) => props.renderHead(item, index))
                                    }
                                </tr>
                            </thead>
                        ) : null
                    }
                    {
                        props.bodyData && props.renderBody ? (
                            <tbody>
                                {
                                    dataShow.map((item, index) => props.renderBody(item, index))
                                }
                            </tbody>
                        ) : null
                    }
                </table>
            </div>

            {
                pages > 1 ? (
                    <div className="table__pagination">
                        <Pagination
                            prev={true}
                            next={true}
                            first={true}
                            last={true}
                            ellipsis={true}
                            boundaryLinks={true}
                            pages={range.length}
                            maxButtons={5}
                            activePage={currPage + 1}
                            onSelect={(key) => selectPage(key - 1)}
                        />
                    </div>
                ) : null
            }
        </div>
    )
}

export default Table
