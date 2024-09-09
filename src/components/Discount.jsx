import { useState } from "react";
import Grid from "@mui/material/Grid2";

import { Button } from "@mui/material";

export const Discount = () => {
  const [discountState, setDiscountState] = useState(null);
  return (
    <>
      {discountState ? (
        <>
          <Grid
            width={"100%"}
            container
            spacing={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {/* Drag Handle */}
            <Grid size={6}>
              <input
                placeholder="Quantity"
                className="box-shadow-style"
                type="number"
              />
            </Grid>
            <Grid size={6}>
              <select className="box-shadow-style">
                <option value="flat">Flat off</option>
                <option value="percent">Percent off</option>
              </select>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <Button
            variant="contained"
            color="primary"
            sx={{ textTransform: "none" }}
            onClick={() => {
              setDiscountState(true);
            }}
          >
            Add Discount
          </Button>
        </>
      )}
    </>
  );
};
