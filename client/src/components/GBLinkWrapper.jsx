import { Link } from '@mui/material'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

export default function GBLinkWrapper({to, children, fs=16, underline=true}) {
    return (
        <Link
            component={RouterLink}
            to={to}
            onClick={() => window.scrollTo(0,0)}
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
