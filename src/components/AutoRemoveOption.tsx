import { Box, Checkbox, FormControlLabel } from "@mui/material";
import React from "react";

interface AutoRemoveOptionProps {
    autoRemoveSpamConnections: boolean;
    onChange: (checked: boolean) => void;
}

const AutoRemoveOption: React.FC<AutoRemoveOptionProps> = ({
    autoRemoveSpamConnections,
    onChange
}) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
    };

    return (
        <Box sx={{ mb: 3 }}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={autoRemoveSpamConnections}
                        onChange={handleChange}
                        color="primary"
                    />
                }
                label="Auto remove spam connections"
            />
        </Box>
    );
};

export default AutoRemoveOption;
