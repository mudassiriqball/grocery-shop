import React, { useEffect, useState } from 'react'
export default function DetectDeviceView() {
    const [isMobile, setIsMobile] = useState();
    const resize = () => {
        setIsMobile(window.innerWidth <= 767);
    }
    useEffect(() => {
        window.addEventListener("resize", resize());
        resize();
        return () => {
            window.removeEventListener("resize", resize());
        }
    }, []);
    return { isMobile };
}
