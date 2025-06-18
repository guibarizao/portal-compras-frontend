import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { Container } from "./Loading.styled";
import IPage from "../../interfaces/IPage";

const Loading: React.FC<IPage> = ({ title }) => {
  window.document.title = title;
  return (
    <Container>
      <Box sx={{ display: "flex" }}>
        <CircularProgress style={{ color: "#3fa110" }} />
      </Box>
    </Container>
  );
};

export { Loading };
