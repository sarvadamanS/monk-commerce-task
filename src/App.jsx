import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Container } from "./components/Container.jsx";
import { Header } from "./components/Header.jsx";
import { ColorPalette } from "./components/Palette.jsx"; // Import the component

import { createTheme, ThemeProvider } from "@mui/material/styles";

import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import ProductSelector from "./components/ProductSelector.jsx";

const ProductContext = createContext();

const App = () => {
  const [color, setColor] = useState("#6a1b9a"); // Default color is black

  const theme = createTheme({
    palette: {
      primary: {
        main: color, // Custom primary color (e.g., orange)
      },
    },
  });
  const [open, setOpen] = React.useState({ modalOpen: false, index: null });
  const handleClickOpen = () => {
    setOpen({ modalOpen: true, index: null });
  };
  const handleClose = () => {
    setOpen({ modalOpen: false, index: null });
  };

  const [productData, setProductData] = useState([
    {
      id: 1,
      text: "",
    },
  ]);
  const addNewProductSlot = () => {
    console.log(productData.length);
    setProductData((prevState, i) => [
      ...prevState,
      { id: productData.length + 1, text: "" },
    ]);
    console.log(productData);
  };
  const deleteCardHandler = (index) => {
    setProductData((prevState) => {
      if (prevState.length > 1) {
        const newState = [...prevState]; // Create a new copy of the array
        newState.splice(index, 1); // Remove the item at the specified index
        return newState; // Return the updated state
      } else {
        return prevState; // If there's only one element, return the same state
      }
    });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Header color={color} setColor={setColor} />
        <Box sx={{ width: "80%", mr: "auto", ml: "auto", mt: "50px" }}>
          <h3>Add Products</h3>
          <Grid container spacing={2}>
            <Grid size={6}>
              <h4>Product</h4>
            </Grid>
            <Grid size={6}>
              <h4>Discount</h4>
            </Grid>
          </Grid>
          <ProductContext.Provider
            value={{ productData, setProductData, setOpen }}
          >
            <DndProvider backend={HTML5Backend}>
              <Container
                myProductData={productData}
                setProducts={setProductData}
                deleteHandler={deleteCardHandler}
              />
            </DndProvider>
          </ProductContext.Provider>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="outlined"
              sx={{
                color: "primary",
                fontFamily: "inherit",
                border: "2px solid ",
                mr: "100px",
                textTransform: "none",
              }}
              onClick={addNewProductSlot}
            >
              Add Product
            </Button>
          </Box>
        </Box>
        <ProductSelector
          modalState={open}
          modalClose={handleClose}
          setProducts={setProductData}
        />
      </ThemeProvider>
    </>
  );
};
export default App;
export { ProductContext };
