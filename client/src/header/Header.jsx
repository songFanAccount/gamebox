import { Stack } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { GBLinkWrapper, GBModalLinkWrapper, GBText } from '../components/generalComponents'
import HeaderNav from './HeaderNav'

export default function Header() {
    const path = useLocation().pathname
    const inGameroom = path.startsWith('/game')
    const GameboxIconButton = () => (
        inGameroom
        ?
            <GBModalLinkWrapper to="/" underline={false} desc="This action will cause you to leave the current room.">
                <GBText text="GameBox" fontFamily="Braah One" fs={40} ml={4}/>
            </GBModalLinkWrapper>
        :
            <GBLinkWrapper to="/" underline={false}>
                <GBText text="GameBox" fontFamily="Braah One" fs={40} ml={4}/>
            </GBLinkWrapper>
    )
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center"
            sx={{
                height: 100, width: '100%',
                position: 'fixed', top:0, left:0,
                color: '#FFFFFF', backgroundColor: '#121212',
                borderBottom: 1, borderColor: '#FFFFFF', boxSizing: 'border-box'
            }}
        >
            <GameboxIconButton/>
            <HeaderNav inGameroom={inGameroom}/>
        </Stack>
    )
}
