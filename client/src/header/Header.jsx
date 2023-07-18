import { Stack } from '@mui/material'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import GBLinkWrapper from '../components/GBLinkWrapper'
import { GBStandardConfirmModal, GBText } from '../components/generalComponents'
import HeaderNav from './HeaderNav'

export default function Header() {
    const path = useLocation().pathname
    const [confirmModalOpen, setOpen] = useState(false)
    const inGameroom = path.startsWith('/game')
    function openConfirmModal() {
        console.log('Opening confirm modal')
        setOpen(true)
    }
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center"
            sx={{
                height: 100, width: '100%',
                position: 'fixed', top:0, left:0,
                color: '#FFFFFF', backgroundColor: '#121212',
                borderBottom: 1, borderColor: '#FFFFFF', boxSizing: 'border-box'
            }}
        >
            <GBStandardConfirmModal
                open={confirmModalOpen}
                onClose={() => setOpen(false)}
                title="Are you sure?"
                desc="This action will cause you to leave the current room."
            >
                
            </GBStandardConfirmModal>
            <GBLinkWrapper to="/" underline={false} interruptFunc={inGameroom && openConfirmModal}>
                <GBText text="GameBox" fontFamily="Braah One" fs={40} ml={4}/>
            </GBLinkWrapper>
            <HeaderNav/>
        </Stack>
    )
}
