import { Stack } from '@mui/material'
import React from 'react'
import { GBLinkWrapper, GBModalLinkWrapper } from '../components/generalComponents'

export default function HeaderNav({inGameroom}) {
    const HeaderNavButton = ({to, linkText}) => (
        inGameroom
        ?
            <GBModalLinkWrapper to={to} desc="This action will cause you to leave the current room.">
                {linkText}
            </GBModalLinkWrapper>
        :
            <GBLinkWrapper to={to}>{linkText}</GBLinkWrapper>
    )
    return (
        <Stack direction="row" columnGap={4} mr={4}>
            <HeaderNavButton to="/" linkText="Home"/>
            <HeaderNavButton to="/about" linkText="About Us"/>
            <HeaderNavButton to="/contact" linkText="Contact Us"/>
        </Stack>
    )
}
