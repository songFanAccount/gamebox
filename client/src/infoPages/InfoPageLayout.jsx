import { Stack } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { GBText } from '../components/generalComponents'
import { getLinear } from '../helpers/mathHelpers'

const Banner = ({screenWidth, pathname}) => {
    const titleFS = getLinear(32, 60, 400, 1100, screenWidth)
    const miniTitleFS = getLinear(14, 26, 400, 1100, screenWidth)
    const bannerHeight = getLinear(120, 300, 400, 1100, screenWidth)
    let title, miniTitle
    switch(pathname) {
        case '/about':
            title = 'What is GameBox?'
            miniTitle = 'Who, when, where, why,'
            break
        case '/contact':
            title = 'Reach out to us!'
            miniTitle = 'Got a question?'
            break
        default:
            throw new Error('Banner: Unknown path!')
    }
    return (
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{
                height: bannerHeight, width: 1,
                borderBottom: 1, borderColor: '#FFFFFF', boxSizing: 'border-box',
                boxShadow: '#FFFFFF 0px 3px 8px',
            }}
        >
            <Stack
                direction="column"
            >
                <GBText text={miniTitle} fs={miniTitleFS} underline="dashed"/>
                <GBText fontFamily="Braah One" text={title} fs={titleFS}/>
            </Stack>
        </Stack>
    )
}
export default function InfoPageLayout() {
    const [screenWidth, setScreenWidth] = useState(window.innerWidth)
    const pathname = useLocation().pathname
    useEffect(() => {
        function handleResize() {
            setScreenWidth(window.innerWidth)
        }
        window.addEventListener("resize", handleResize)
        return _ => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])
    return (
        <Stack
            sx={{
                width: 1
            }}
        >
            <Banner screenWidth={screenWidth} pathname={pathname}/>
            <Outlet/>
        </Stack>
    )
}
