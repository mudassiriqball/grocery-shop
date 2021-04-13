import baseUrl from '../urls/baseUrl'
import axios from 'axios'
import React, { Component, useState, useEffect } from 'react';

export default async function getRequestServices(_url) {
    const [data, setData] = useState([])
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        getData()
        return () => { }
    }, [])

    const getData = async () => {
        await axios(_url, config).then(res => {
            setSuccess(true)
            setData(res.data.data)
        }).catch(err => {
            setData([])
            setSuccess(false)
            setError(true)
        })
    }

    return { loading, data, success, error }
}

