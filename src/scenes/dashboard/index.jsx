import { Box, Typography, useTheme } from "@mui/material";
import PendingRefunds from "../../components/Counter"; // PendingRefunds bileşeni
import { tokens } from "../../theme";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      sx={{
        padding: "20px",
        backgroundColor: colors.primary[400],
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Başlık */}
      <Typography
        variant="h4"
        fontWeight="bold"
        color={colors.grey[100]}
        sx={{ marginBottom: "20px" }}
      >
        Dashboard
      </Typography>

      {/* Pending Refunds */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          backgroundColor: colors.primary[400],
          borderRadius: "8px",
        }}
      >
        <PendingRefunds />
      </Box>
    </Box>
  );
};

export default Dashboard;
