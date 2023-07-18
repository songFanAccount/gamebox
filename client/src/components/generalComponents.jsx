import { Box, Button, IconButton, InputAdornment, InputBase, Modal, Stack, TextField, Typography, Link } from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export function GBText({text, fontFamily='Orbit', fs=20, ml=0,
                        color='#FFFFFF', backgroundColor='#121212', invert=false,
                        bold, underline,
                        width='fit-content', maxWidth=1}) {
    const textColor = invert ? backgroundColor : color
    const bgColor = invert ? color : backgroundColor
    return (
        <Typography
            sx={{
                color: textColor,
                fontFamily: fontFamily, fontSize: fs, fontWeight: bold ? 'bold' : 'auto',
                width: width, maxWidth: maxWidth,
                ml: ml,
                borderBottom: underline ? 2 : 0, borderBottomStyle: underline, borderColor: textColor,
                '::selection': {
                    color: bgColor,
                    backgroundColor: textColor
                }
            }}
        >
            {text}
        </Typography>
    )
}
export function GBNakedInput({value, onChange, width=200, placeholder, maxLength=50, color='#FFFFFF', backgroundColor='#121212', fs=20,
                              onKeyDown,
                              spellCheck=false}) {
    return (
        <InputBase
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            spellCheck={spellCheck}
            inputProps={{
                maxLength: maxLength,
                sx: {
                    py: 1, mx: '10px',
                    width: width - 20,
                    color: color, backgroundColor: backgroundColor,
                    fontFamily: 'Orbit', fontSize: fs,
                    '::selection': {
                        color: backgroundColor,
                        backgroundColor: color
                    }
                }
            }}
        />
    )
}
export function GBTextInput({value, onChange, variant="standard", width=200, placeholder, maxLength=50, type="text", fs=20,
                             color='#FFFFFF', backgroundColor='#121212',
                             spellCheck=false}) {
    const [pwVisible, setPwVisible] = useState(false)
    let endAdornment = null
    if(type === 'password') {
        if(pwVisible) type = 'text'
        endAdornment = (
            <IconButton 
                onClick={() => setPwVisible(!pwVisible)}
                disableRipple
                aria-label={pwVisible ? "Hide password" : "Show password"} 
                sx={{color: color}}
            >
                {pwVisible ? <VisibilityOffIcon/> : <VisibilityIcon/>}
            </IconButton>
        )
    }
    return (
        <TextField
            type={type}
            variant={variant}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            autoComplete='new-password'
            placeholder={placeholder}
            size="small"
            spellCheck={spellCheck}
            inputProps={{
                maxLength: maxLength,
                sx: {
                    color: color,
                    letterSpacing: type==='password' ? 3 : 'normal',
                    fontFamily: type==='password' ? 'Verdana' : 'Orbit', fontSize: fs,
                    '::selection': {
                        color: backgroundColor,
                        backgroundColor: color
                    }
                }
            }}
            InputProps={{
                endAdornment: <InputAdornment position="end">{endAdornment}</InputAdornment>
            }}
            sx={{
                width: width,
                '& .MuiInput-underline': {
                    ':hover:not(.Mui-disabled, .Mui-error):before': { borderColor: color },
                    ':before': { borderColor: color },
                    ':after': { borderColor: color },
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: color },
                    '&:hover fieldset': { borderColor: color },
                    '&.Mui-focused fieldset': { borderColor: color }
                }
            }}
        />
    )
}
export function GBButtonWrapper({onClick, children,
                                 ml=0}) {
    return (
        <Button
            onClick={onClick}
            disableRipple
            sx={{
                textTransform: 'none',
                ml: ml, px: 0,
                '&:hover': {
                    backgroundColor: 'transparent'
                }
            }}
        >
            {children}
        </Button>
    )
}
export function GBButton({onClick, children, color='#FFFFFF', backgroundColor='#121212', width='fit-content', className, border=1, 
                          fs=20, fontFamily="Orbit",
                          invert=false, disabled=false,  noDisableFx=false,
                          ml=0, px=1.5, py=0.5,
                          endIcon}) {
    const textColor = invert ? backgroundColor : color
    const bgColor = invert ? color : backgroundColor
    const hoverSx = {color:bgColor, backgroundColor:textColor}
    return (
        <Button
            className={className}
            onClick={onClick}
            disableRipple
            disabled={disabled}
            endIcon={endIcon}
            sx={{
                m: 0, px: px, py: py, ml: ml,
                color: textColor, backgroundColor: bgColor,
                border: border,
                fontFamily: fontFamily, fontSize: fs,
                minWidth: 0, width: width,
                overflowX: 'hidden', whiteSpace: 'nowrap', overflowY: 'hidden',
                boxSizing: 'border-box',
                textTransform: 'none',
                '&:hover': hoverSx,
                ':disabled': noDisableFx ? {color : textColor} : {borderColor: color, color: color},
                '& .MuiButton-endIcon': {
                    mt: 0.2,
                    ml: 2,
                }
            }}
        >
            {children}
        </Button>
    )
}

export function GBModalWrapper({open, onClose, children}) {
    return (
        <Modal
            open={open}
            onClose={onClose}
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#FFFFFF',
                    maxWidth: 400,
                    p: 3,
                    boxSizing: 'border-box', border: 10, borderRadius: 5, borderStyle: 'dashed'
                }}
            >
                {children}
            </Box>
        </Modal>
    )
}

export function GBStandardConfirmModal({open, onClose, 
                                        title, desc, 
                                        cancelText="Cancel", confirmText="Confirm",
                                        cancelFunc, confirmFunc}) {
    return (
        <GBModalWrapper
            open={open}
            onClose={onClose}
        >
            <Stack
                direction="column"
                rowGap={3}
            >
                <GBText invert fontFamily="Montserrat" text={title}/>
                <GBText invert fontFamily="Montserrat" fs={16} text={desc}/>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                >
                    <GBButton
                        invert
                        fontFamily="Montserrat" fs={16}
                        onClick={cancelFunc}
                    >
                        {cancelText}
                    </GBButton>
                    <GBButton
                        invert
                        fontFamily="Montserrat" fs={16}
                        onClick={confirmFunc}
                    >
                        {confirmText}
                    </GBButton>
                </Stack>
            </Stack>
        </GBModalWrapper>
    )
}

export function GBLinkWrapper({to, children, fs=16, underline=true, interruptFunc=null}) {
    function onClick(event) {
        if(interruptFunc) {
            event.preventDefault()
            interruptFunc(to)
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

export function GBModalLinkWrapper({to, children, fs=16, underline=true,
                                    title="Are you sure?", desc}) {
    const [modalOpen, setModalOpen] = useState(false)
    const navigate = useNavigate()
    function confirmModal() {
        setModalOpen(false)
        navigate(to)
    }
    return (
        <>
            <GBStandardConfirmModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                title={title}
                desc={desc}
                cancelFunc={() => setModalOpen(false)}
                confirmFunc={confirmModal}
            />
            <GBLinkWrapper to={to} fs={fs} underline={underline} interruptFunc={() => setModalOpen(true)}>
                {children}
            </GBLinkWrapper>
        </>
    )
}