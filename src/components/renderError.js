import React from 'react'

import consts from '../constants';

export default function renderError(error) {
    return (
        <div style={{ width: '100%' }}>
            <label style={{ color: consts.COLORS.ERROR, fontSize: consts.SIZES.ERROR }}>{error}</label>
        </div>
    )
}
