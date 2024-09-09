// Modal content component
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export const InfoModalContent = ({ onClose }) => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        sx={{ fontWeight: "bold", color: "#1976d2" }}
      >
        🛍️ Project Information
      </Typography>
      <Typography sx={{ mt: 2, fontSize: "1rem", color: "#555" }}>
        This project is a shopping application built with React and Material-UI.
        It includes several key features that enhance the user experience and
        product management functionalities.
      </Typography>

      <Typography
        sx={{ mt: 2, fontSize: "1.2rem", fontWeight: "bold", color: "#333" }}
      >
        Key Features:
      </Typography>

      <ul
        style={{
          marginTop: "10px",
          marginLeft: "20px",
          color: "#444",
          fontSize: "1rem",
        }}
      >
        <li>
          🛠️ <b>Product and variant management</b>: Products and variants are
          draggable and reorderable.
        </li>
        <li>
          🗑️ <b>Delete functionality</b>: Products have a delete option.
          Variants do not have a delete option yet, but the functionality can be
          reused.
        </li>
        <li>
          🎨 <b>Color customization</b>: Users can change the primary color of
          the app using the "Choose Color" button.
        </li>
        <li>
          🔍 <b>Search bar</b>: When the search bar is empty, it shows all
          products, filtered by 10 at a time. With a search query, results are
          filtered accordingly, showing 10 at a time.
        </li>
      </ul>

      <Typography sx={{ mt: 2, fontSize: "1rem", color: "#555" }}>
        This project was developed with a focus on core functionalities. Some
        design differences exist from the Figma file due to time constraints.
      </Typography>

      <Typography
        sx={{ mt: 3, fontSize: "1rem", fontWeight: "bold", color: "#333" }}
      >
        🚀 Created by Sarvadaman Singh
      </Typography>

      <Typography sx={{ mt: 1, fontSize: "1rem", color: "#1976d2" }}>
        GitHub:{" "}
        <a
          href="https://github.com/sarvadamanS"
          style={{ color: "#1976d2", textDecoration: "none" }}
        >
          github.com/sarvadamanS
        </a>
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            mt: 3,
            backgroundColor: "#333",
            color: "#fff",
          }}
        >
          Close
        </Button>
      </Box>
    </Box>
  );
};
