import { Button, TextField, Typography } from "@mui/material";

export function GBText({text}) {
    return (
        <Typography
            sx={{
                color: '#FFFFFF',
                fontFamily: 'Orbit', fontSize: 20,
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
export function GBTextInput({value, onChange, variant="standard", width=200, placeholder,
                             color='#FFFFFF', backgroundColor='#121212'}) {
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
                    color: color,
                    fontFamily: 'Orbit', fontSize: 20,
                    '::selection': {
                        color: backgroundColor,
                        backgroundColor: color
                    }
                },
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
export function GBButton({onClick, children, color='#FFFFFF', backgroundColor='#121212', width='fit-content', className, border=1, fs=20,
                          invert=false, disabled=false,  noDisableFx=true,
                          ml=0, px=2, py=1,
                          endIcon,
                          hoverSx={color:'#121212', backgroundColor:'#FFFFFF'}}) {
    const textColor = invert ? backgroundColor : color
    const bgColor = invert ? color : backgroundColor
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
                fontFamily: 'Orbit', fontSize: fs,
                minWidth: 0, width: width,
                overflowX: 'hidden', whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                textTransform: 'none',
                '&:hover': hoverSx,
                ':disabled': noDisableFx ? {color : textColor} : {},
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