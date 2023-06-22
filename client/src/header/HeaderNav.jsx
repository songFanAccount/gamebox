import { Stack } from '@mui/material'
import React from 'react'
import GBLinkWrapper from '../components/GBLinkWrapper'

export default function HeaderNav() {
    return (
        <Stack direction="row" columnGap={4} mr={4}>
            <GBLinkWrapper to="/">Home</GBLinkWrapper>
            <GBLinkWrapper to="/about">About Us</GBLinkWrapper>
            <GBLinkWrapper to="/contact">Contact Us</GBLinkWrapper>
        </Stack>
    )
}
