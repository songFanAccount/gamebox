import React from "react"
import { GBButton } from "../../components/generalComponents"
import { Box, IconButton } from "@mui/material"

export default function GameButton({gameName, onClick, isHost}) {
    return (
        <Box>
            <GBButton children={gameName} onClick={() => onClick(gameName)} disabled={!isHost}/>
            <GBButton children={"recommend"} onClick={() => console.log("added to 'to play next'")}/>
            {/* <IconButton  onClick={() => console.log("Moved into 'to play next'")}/> */}
        </Box>
    )
}