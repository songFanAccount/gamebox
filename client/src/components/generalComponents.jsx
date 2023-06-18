import { Button, Stack, TextField } from "@mui/material";

export function GBTextInput({value, onChange, variant="outlined", width=250, placeholder}) {
    return (
        <TextField
            variant={variant}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            sx={{
                width: width,
                "& .MuiInputBase-input": {
                    color: '#FFFFFF',
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
                color: color
            }}
        >
            {children}
        </Button>
    )
}