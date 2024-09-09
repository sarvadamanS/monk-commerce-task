import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Discount } from "./Discount";
import Grid from "@mui/material/Grid2";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import Box from "@mui/material/Box";

const variantStyle = {
  borderBottom: "1px solid gray",
  padding: "0.5rem",
  backgroundColor: "transparent",
  position: "relative",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "0.5rem",
};

// Specific style for the draggable handle
const handleStyle = {
  backgroundColor: "transparent",
  padding: "0.2rem",
  cursor: "grab", // Show grab cursor only on the handle
};

export const Variant = ({ id, name, price, index, moveVariant }) => {
  const ref = useRef(null);

  // Setup drop logic
  const [, drop] = useDrop({
    accept: "variant",
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveVariant(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Drag logic
  const [{ isDragging }, drag, preview] = useDrag({
    type: "variant",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;
  preview(drop(ref));

  return (
    <div ref={ref} style={{ ...variantStyle, opacity }}>
      <Grid
        width={"100%"}
        container
        spacing={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid size={1}>
          <div style={handleStyle} ref={drag}>
            <DragIndicatorIcon
              color="primary"
              sx={{ opacity: "0.5", "&:hover": { opacity: "1" } }}
            />
          </div>
        </Grid>
        <Grid size={6}>
          <Box sx={{ textAlign: "center" }}>
            {name} - ${price}
          </Box>
        </Grid>
        <Grid size={5}>
          <Discount />
        </Grid>
      </Grid>
    </div>
  );
};
