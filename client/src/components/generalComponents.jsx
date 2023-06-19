import { Button, TextField, Typography } from "@mui/material";

export function GBText({text}) {
    return (
        <Typography
            sx={{
                color: '#FFFFFF',
                fontFamily: 'Verdana',
                fontWeight: 'bold',
                '::selection': {
                    color: '#121212',
                    backgroundColor: '#FFFFFF'
                }
            }}
        >
            {text}
        </Typography>
    )
}
export function GBTextInput({value, onChange, variant="outlined", width=250, placeholder}) {
    return (
        <TextField
            variant={variant}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            size="small"
            sx={{
                width: width,
                "& .MuiInputBase-input": {
                    color: '#FFFFFF',
                    fontFamily: 'Verdana',
                    '::selection': {
                        color: '#121212',
                        backgroundColor: '#FFFFFF'
                    }
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                        borderColor: '#FFFFFF'
                    },
                    '&:hover fieldset': {
                        borderColor: '#FFFFFF'
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#FFFFFF'
                    }
                }
            }}
        />
    )
}
export function GBButton({onClick, children, color='#FFFFFF', backgroundColor='#121212', width='fit-content', className, border=1,
                          invert=false, disabled=false,  noDisableFx=true,
                          hoverSx={color:'#121212', backgroundColor:'#FFFFFF'}}) {
    const textColor = invert ? backgroundColor : color
    const bgColor = invert ? color : backgroundColor
    return (
        <Button
            className={className}
            onClick={onClick}
            disableRipple
            disabled={disabled}
            sx={{
                m: 0,
                px: 0,
                color: textColor,
                backgroundColor: bgColor,
                border: border,
                fontFamily: 'Verdana',
                fontWeight: 'bold',
                minWidth: 0,
                width: width,
                overflowX: 'hidden',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                textTransform: 'none',
                '&:hover': hoverSx,
                ':disabled': noDisableFx ? {color : textColor} : {}
            }}
        >
            {children}
        </Button>
    )
}