import { Stack } from '@mui/material'
import React from 'react'
import GBLinkWrapper from '../components/GBLinkWrapper'
import { GBText } from '../components/generalComponents'
import HeaderNav from './HeaderNav'

export default function Header() {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center"
            sx={{
                height: 100, width: '100%',
                position: 'fixed', top:0, left:0,
                color: '#FFFFFF', backgroundColor: '#121212',
                borderBottom: 1, borderColor: '#FFFFFF', boxSizing: 'border-box'
            }}
        >
            <GBLinkWrapper to="/" underline={false}>
                <GBText text="GameBox" fontFamily="Braah One" fs={40} ml={4}/>
            </GBLinkWrapper>
            <HeaderNav/>
        </Stack>
    )
}
