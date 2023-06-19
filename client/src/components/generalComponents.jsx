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
                          invert=false, hoverSx={color:'#121212', backgroundColor:'#FFFFFF'}}) {
    return (
        <Button
            className={className}
            onClick={onClick}
            disableRipple
            sx={{
                m: 0,
                px: 0,
                color: invert ? backgroundColor : color,
                border: border,
                backgroundColor: invert ? color : backgroundColor,
                fontFamily: 'Verdana',
                fontWeight: 'bold',
                minWidth: 0,
                width: width,
                overflowX: 'hidden',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box',
                '&:hover': hoverSx
            }}
        >
            {children}
        </Button>
    )
}