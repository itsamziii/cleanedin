import { Box, Button } from "@mui/material";
import React from "react";

interface SaveButtonProps {
    isSaved: boolean;
    onSave: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({ isSaved, onSave }) => {
    return (
        <Box
            sx={{
                mt: "auto",
                display: "flex",
                justifyContent: "center"
            }}
        >
            <Button
                variant="contained"
                color="primary"
                onClick={onSave}
                fullWidth
            >
                {isSaved ? "Saved!" : "Save Settings"}
            </Button>
        </Box>
    );
};

export default SaveButton;
