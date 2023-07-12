import React from "react"
import { GBButton } from "../../components/generalComponents"

export default function GameButton({gameName, onClick, isHost}) {
    return (
        <GBButton children={gameName} onClick={() => onClick(gameName)} disabled={!isHost}/>
    )
}