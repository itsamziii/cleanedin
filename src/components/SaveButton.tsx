import { Box, Button } from "@mui/material";
import React from "react";

interface SaveButtonProps {
    isSaved: boolean;
    loading: boolean;
    onSave: () => void;
}

const SaveButton: React.FC<SaveButtonProps> = ({
    isSaved,
    onSave,
    loading
}) => {
    return (
        <Button
            variant="contained"
            color="primary"
            onClick={onSave}
            disabled={loading}
            fullWidth
        >
            {isSaved ? "Saved!" : "Save Settings"}
        </Button>
    );
};

export default SaveButton;
