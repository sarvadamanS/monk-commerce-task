import React, { useState } from "react";
import { Button, Popover, Box } from "@mui/material";
import { ChromePicker } from "react-color"; // Importing react-color's ChromePicker

export const ColorPalette = ({ selectedColor, setSelectedColor }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle click to open the color picker popover
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing of the color picker popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle color change event
  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
  };

  const open = Boolean(anchorEl);
  const id = open ? "color-palette-popover" : undefined;

  return (
    <Box>
      {/* Button to trigger the color picker */}
      <Button
        aria-describedby={id}
        variant="contained"
        onClick={handleClick}
        sx={{
          backgroundColor: "#fff",
          color: "black",
          textTransform: "none",
        }}
      >
        Choose Color
      </Button>

      {/* Popover that contains the color picker */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        {/* Color picker from react-color */}
        <ChromePicker
          color={selectedColor}
          onChange={handleColorChange}
          disableAlpha
        />
      </Popover>
    </Box>
  );
};
