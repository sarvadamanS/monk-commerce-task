import { useEffect, useRef, useState, useCallback, useContext } from "react";
import { useDrag, useDrop } from "react-dnd";
import { ProductContext } from "../App";
import update from "immutability-helper";

import { TextEdit } from "./TextEdit";
import { Variant } from "./VariantComponent";
import Grid from "@mui/material/Grid2";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";

import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Discount } from "./Discount";
import { productData } from "./SampleProductData";

const style = {
  borderBottom: "1px solid gray",
  padding: "0rem",
  marginBottom: "0.5rem",
  backgroundColor: "transparent",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

// Specific style for the draggable handle
const handleStyle = {
  backgroundColor: "transparent",
  padding: "0.2rem",
  cursor: "grab", // Show grab cursor only on the handle
};

export const Card = ({
  id,
  text,
  index,
  moveCard,
  deleteCard,
  variants,
  setProducts,
}) => {
  const { productData } = useContext(ProductContext);

  const [showVariants, setShowVariants] = useState(false);
  const [showVariantsButton, setShowVariantsButton] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const ref = useRef(null);
  const moveVariant = useCallback(
    (dragIndex, hoverIndex) => {
      setProducts((prevCards) =>
        prevCards.map((card, cardIndex) => {
          if (cardIndex === index) {
            // Move the variant within the current card
            const updatedVariants = update(card.variants, {
              $splice: [
                [dragIndex, 1],
                [hoverIndex, 0, card.variants[dragIndex]],
              ],
            });
            return { ...card, variants: updatedVariants };
          }
          return card;
        })
      );
    },
    [index, setProducts]
  );
  // Setup drop logic
  const [{ handlerId }, drop] = useDrop({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;

      // If the item is dragged over itself, do nothing
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // Perform the move
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Drag logic
  const [{ isDragging }, drag, preview] = useDrag({
    type: "card",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.5 : 1;

  // Attach drop to the entire card but drag only to the handle
  preview(drop(ref));

  useEffect(() => {
    if (variants?.length > 1) {
      setShowVariantsButton(true);
    }
    if (productData?.length > 1) {
      setShowDeleteButton(true);
    } else {
      setShowDeleteButton(false);
    }
  }, [variants, productData]);
  return (
    <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
      <Grid
        width={"100%"}
        container
        spacing={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        {/* Drag Handle */}
        <Grid size={1}>
          <div style={handleStyle} ref={drag}>
            <DragIndicatorIcon
              color="primary"
              sx={{
                opacity: "0.5",
                "&:hover": {
                  opacity: "1",
                },
              }}
            />
          </div>
        </Grid>

        {/* Index */}
        <Grid size={1}>{index + 1}.</Grid>

        {/* Editable Text */}
        <Grid size={4}>
          <TextEdit index={index} text={text} />
        </Grid>
        <Grid size={4} sx={{ display: "flex", flexDirection: "row" }}>
          <Discount />
        </Grid>
        {/* Remove Icon */}
        <Grid size={2}>
          {showDeleteButton ? (
            <CloseIcon
              fontSize="small"
              sx={{ color: "grey", "&:hover": { color: "red" } }}
              onClick={() => {
                deleteCard(index);
              }}
            />
          ) : (
            ""
          )}
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        {showVariantsButton && (
          <Button
            variant="outlined"
            sx={{
              border: "none",
              textTransform: "none",
              textDecoration: "underline",
              mr: "10%",
            }}
            endIcon={showVariants ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setShowVariants(!showVariants)}
          >
            {showVariants ? "Hide Variants" : "Show Variants"}
          </Button>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          flexDirection: "column",
          ml: "5%",
        }}
      >
        {showVariants &&
          variants.map((variant, i) => (
            <Variant
              key={variant.id}
              id={variant.id}
              name={variant.name}
              price={variant.price}
              index={i}
              moveVariant={moveVariant} // Pass the moveVariant function
            />
          ))}
      </Box>
    </div>
  );
};
