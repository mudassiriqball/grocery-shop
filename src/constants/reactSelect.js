export default {
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    menu: provided => ({ ...provided, zIndex: 9999 }),
    control: (base) => ({
        ...base,
        fontSize: '13px',
    }),
    dropdownIndicator: (base) => ({
        ...base,
        paddingTop: 0,
        paddingBottom: 0,
        fontSize: '13px',
    }),
    clearIndicator: (base) => ({
        ...base,
        paddingTop: 0,
        paddingBottom: 0,
        fontSize: '13px',
    }),
    option: provided => ({
        ...provided,
        fontSize: '13px',
        display: 'absolute',
        zIndex: '1000',
    }),
}