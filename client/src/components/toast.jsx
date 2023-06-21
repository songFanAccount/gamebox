import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, Slide } from "react-toastify";

export function GBToastContainer() {
    return (
        <ToastContainer
            position="bottom-center"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable={false}
            pauseOnHover
            theme="dark"
            fullWidth
            transition={Slide}
            style={{
                width:'fit-content'
            }}
        />
    )
}

export const toastStyle = {
    position: "bottom-center",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "colored",
}