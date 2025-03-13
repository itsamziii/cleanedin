import AddIcon from "@mui/icons-material/Add";
import {
    Box,
    Chip,
    IconButton,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import React, { useState } from "react";
import { type Tag } from "../types";

interface TagManagementProps {
    tags: Tag[];
    onTagsChange: (tags: Tag[]) => void;
}

const TagManagement: React.FC<TagManagementProps> = ({
    tags,
    onTagsChange
}) => {
    const [newTag, setNewTag] = useState<string>("");

    const addTag = () => {
        if (
            newTag.trim() !== "" &&
            !tags.some((tag) => tag.name === newTag.trim())
        ) {
            const newTagObject: Tag = {
                id: Date.now(),
                name: newTag.trim(),
                removable: true
            };

            onTagsChange([...tags, newTagObject]);
            setNewTag("");
        }
    };

    const removeTag = (id: number) => {
        onTagsChange(tags.filter((tag) => tag.id !== id));
    };

    const handleNewTagChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTag(event.target.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter") {
            addTag();
        }
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Typography
                variant="subtitle1"
                sx={{ mb: 1, fontWeight: "medium" }}
            >
                Tag Management
            </Typography>
            <Box sx={{ display: "flex", mb: 1 }}>
                <TextField
                    label="Add new tag"
                    size="small"
                    fullWidth
                    value={newTag}
                    onChange={handleNewTagChange}
                    onKeyPress={handleKeyPress}
                />
                <IconButton
                    color="primary"
                    onClick={addTag}
                    disabled={newTag.trim() === ""}
                    sx={{ ml: 1 }}
                >
                    <AddIcon />
                </IconButton>
            </Box>
            <Paper
                variant="outlined"
                sx={{
                    p: 1,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    minHeight: "50px"
                }}
            >
                {tags.map((tag) => (
                    <Chip
                        key={tag.id}
                        label={tag.name}
                        onDelete={
                            tag.removable ? () => removeTag(tag.id) : undefined
                        }
                        color={tag.name === "spam" ? "primary" : "default"}
                    />
                ))}
            </Paper>
        </Box>
    );
};

export default TagManagement;
