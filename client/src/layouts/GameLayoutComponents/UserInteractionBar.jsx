import React from "react"

import { Box } from '@mui/material'

import UserList from "./UserList"
import Messenger from "./Messenger"

export default function UserInteractionBar() {
    return (
        <Box
            sx={{
                border: 1,
                borderRadius: 1,
                m: 1,
                ml: 0,
                minWidth: 250
            }}
        >
            <UserList/>
            <Messenger/>
        </Box>
    )
}