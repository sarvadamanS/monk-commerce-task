import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function ProductSelector(props) {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProductData, setSelectedProductData] = useState([]);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const scrollContainerRef = useRef(null);

  // Function to check if the user has scrolled to the bottom
  const handleScroll = () => {
    const scrollContainer = scrollContainerRef.current;
    // console.log(scrollContainer);
    if (scrollContainer) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setHasReachedBottom(true); // Trigger when bottom is reached
      } else {
        setHasReachedBottom(false);
      }
    }
  };

  // Fetch products with debounced API call logic
  const fetchProducts = async (page = 1) => {
    try {
      if (loading) return; // Prevent multiple calls if already loading
      setLoading(true);
      const endpoint = searchText
        ? `http://stageapi.monkcommerce.app/task/products/search?search=${searchText}&page=${page}&limit=10`
        : `http://stageapi.monkcommerce.app/task/products/search?page=${page}&limit=10`;

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `72njgfa948d9aS7gs5`,
        },
      });
      const data = await response.json();
      if (searchText) {
        const filtered = data.filter((product) =>
          product.title.toLowerCase().includes(searchText.toLowerCase())
        );
        if (page === 1) {
          setFilteredProducts(filtered);
        } else {
          setFilteredProducts((prevState) => [...prevState, ...filtered]);
        }
      } else {
        if (page === 1) {
          setFilteredProducts(data);
        } else {
          setFilteredProducts((prevState) => [...prevState, ...data]);
        }
      }
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props.modalState.modalOpen) {
      fetchProducts();
      setPageNumber(1);
    }
  }, [searchText, props.modalState.modalOpen]);
  useEffect(() => {
    if (hasReachedBottom && !loading) {
      // Increment page number and reset hasReachedBottom
      console.log("Reached the bottom!");

      setPageNumber((prevPageNumber) => prevPageNumber + 1);
      setHasReachedBottom(false);
    }
  }, [hasReachedBottom, loading]); // Only trigger when hasReachedBottom or loading changes

  useEffect(() => {
    if (pageNumber) {
      fetchProducts(pageNumber);
    }
  }, [pageNumber]); // Trigger fetching when pageNumber change
  // Handle product checkbox change
  const handleProductChange = (productId) => {
    setSelectedProductData((prev) => {
      // Check if the product is already selected
      const isSelected = prev.find((p) => p.productId === productId);
      if (isSelected) {
        // If the product is selected, deselect it and remove its variants
        return prev.filter((p) => p.productId !== productId);
      } else {
        // If the product is not selected, select it and all its variants
        const product = filteredProducts.find((p) => p.id === productId);
        const variants = product.variants.map((v) => ({
          id: v.id,
          name: v.title, // Include variant name
          price: v.price,
        }));

        return [
          ...prev,
          {
            productId,
            productName: product.title,
            variants,
          },
        ];
      }
    });
  };

  const handleVariantChange = (productId, variantId) => {
    setSelectedProductData((prev) => {
      // Find the product entry in the selected data
      const productEntry = prev.find((p) => p.productId === productId);
      if (productEntry) {
        const variantData = filteredProducts
          .find((p) => p.id === productId)
          .variants.find((v) => v.id === variantId);

        // Toggle the variant in the list
        const updatedVariants = productEntry.variants.some(
          (v) => v.id === variantId
        )
          ? productEntry.variants.filter((v) => v.id !== variantId)
          : [
              ...productEntry.variants,
              {
                id: variantId,
                name: variantData.title, // Include variant name
                price: variantData.price,
              },
            ];

        return prev.map((p) =>
          p.productId === productId ? { ...p, variants: updatedVariants } : p
        );
      }
      return prev;
    });
  };

  const updateProductData = () => {
    console.log("Selected Product Data:", selectedProductData);

    props.setProducts((prevState) => {
      const updatedState = [...prevState];
      const index = props.modalState.index;
      console.log("Index:", index);

      // Determine the next ID based on the current state
      const nextId = updatedState.reduce(
        (maxId, product) => Math.max(product.id, maxId),
        -1
      );
      // Create new products with unique IDs
      const newProducts = selectedProductData.map((productData, i) => ({
        id: productData.productId, // Ensure unique IDs for the new products
        text: productData.productName,
        variants: productData.variants,
      }));
      const lastIndex = newProducts.reduce(
        (maxId, product) => Math.max(product.id, maxId),
        -1
      );
      console.log(lastIndex);
      // Remove products at the specified index if they exist
      const productsBeforeIndex = updatedState.slice(0, index);
      let productsAfterIndex = updatedState.slice(index + 1);
      // productsAfterIndex.forEach((el, i) => (el.id = lastIndex + i + 1));
      console.log(productsBeforeIndex, productsAfterIndex);
      // Combine the new products with the remaining products
      const updatedProducts = [
        ...productsBeforeIndex,
        ...newProducts, // Add new products
        ...productsAfterIndex, // Add remaining products
      ];

      // Log the updated state
      console.log("Updated Product Data State:", updatedProducts);

      return updatedProducts;
    });

    props.modalClose();
    setSelectedProductData([]);
  };

  return (
    <BootstrapDialog
      onClose={props.modalClose}
      open={props.modalState.modalOpen}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Select Products
      </DialogTitle>
      <IconButton
        onClick={props.modalClose}
        sx={(theme) => ({
          position: "absolute",
          right: 8,
          top: 8,
          color: theme.palette.grey[800],
        })}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers onScroll={handleScroll} ref={scrollContainerRef}>
        <Box sx={{ "& > :not(style)": { m: 1 } }}>
          <TextField
            id="input-with-icon-textfield"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search for products"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />{" "}
                </InputAdornment>
              ),
            }}
            variant="outlined"
            fullWidth
          />
        </Box>
        <Typography gutterBottom>Product List</Typography>
        <Box>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, i) => (
              <Box
                key={product.id}
                sx={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                }}
              >
                {/* Product Checkbox */}
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    id={`product-checkbox-${product.id}`}
                    name={`product-checkbox-${product.id}`}
                    checked={
                      !!selectedProductData.find(
                        (p) => p.productId === product.id
                      )
                    }
                    onChange={() => handleProductChange(product.id)}
                    style={{ accentColor: "primary" }}
                  />

                  <img
                    src={product.image.src}
                    alt={product.title}
                    width="50"
                    height="50"
                    style={{ marginRight: "10px" }}
                  />
                  <Typography>{product.title}</Typography>
                </Box>

                {/* Variants List */}
                <Box sx={{ marginLeft: "30px", marginTop: "10px" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Variants:
                  </Typography>
                  {product.variants.map((variant) => (
                    <Box
                      key={variant.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`variant-checkbox-${variant.id}`}
                        name={`variant-checkbox-${variant.id}`}
                        checked={
                          !!selectedProductData.find(
                            (p) =>
                              p.productId === product.id &&
                              p.variants.some((v) => v.id === variant.id) // Check if variant ID is present in the variants array
                          )
                        }
                        onChange={() =>
                          handleVariantChange(product.id, variant.id)
                        }
                      />

                      <Typography sx={{ marginLeft: "10px" }}>
                        {variant.title} - ${variant.price}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))
          ) : (
            <Typography>No products found</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.modalClose}>Cancel</Button>
        <Button variant="contained" autoFocus onClick={updateProductData}>
          Add
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}
