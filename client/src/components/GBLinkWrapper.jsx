import { Link } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

export default function GBLinkWrapper({to, children, fs=16, underline=true, interruptFunc=null}) {
    function onClick(event) {
        if(interruptFunc) {
            event.preventDefault()
            interruptFunc()
        } else {
            window.scrollTo(0,0)
        }
    }
    return (
        <Link
            component={RouterLink}
            to={to}
            onClick={(e) => onClick(e)}
            sx={{
                color: '#FFFFFF',
                fontFamily: 'Orbit', fontSize: fs,
                textDecoration: 'none',
                textUnderlineOffset: 4,
                '&:hover': {
                    textDecoration: underline ? 'underline' : 'none'
                }
            }}
        >
            {children}
        </Link>
    )
}
