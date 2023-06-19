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
export function GBButton({onClick, children, color='#FFFFFF'}) {
    return (
        <Button
            onClick={onClick}
            sx={{
                m: 0,
                color: color,
                fontFamily: 'Verdana',
                fontWeight: 'bold'
            }}
        >
            {children}
        </Button>
    )
}