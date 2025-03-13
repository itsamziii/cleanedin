import { Alert, Snackbar } from "@mui/material";
import React from "react";

interface ErrorSnackbarProps {
    open: boolean;
    message: string;
    onClose: () => void;
}

const ErrorSnackbar: React.FC<ErrorSnackbarProps> = ({
    open,
    message,
    onClose
}) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert onClose={onClose} severity="error" sx={{ width: "100%" }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default ErrorSnackbar;
