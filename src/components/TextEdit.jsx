import { useContext } from "react";
import { ProductContext } from "../App";

import EditIcon from "@mui/icons-material/Edit";

export const TextEdit = ({ index, text }) => {
  const { setOpen } = useContext(ProductContext);
  return (
    <div className="input-text box-shadow-style">
      <input placeholder="Select Product" value={text} readOnly></input>
      <button>
        <EditIcon
          color="primary"
          sx={{
            opacity: "0.5",
            "&:hover": {
              opacity: "1",
            },
          }}
          onClick={() => {
            setOpen({ modalOpen: true, index: index });
          }}
        />
      </button>
    </div>
  );
};
