import React from "react"

import { Box } from '@mui/material'

import UserList from "./UserList"
import Messenger from "./Messenger"

export default function UserInteractionBar() {
    return (
        <Box
            sx={{color: "white"}}
        >
            <UserList/>
            <Messenger/>
        </Box>
    )
}