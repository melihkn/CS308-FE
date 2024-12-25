import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { fetchTotalRevenueAndCost } from "../../smapi/smAPI"; // API fonksiyonunu import ediyoruz
import Header from "../../components/Header";
import ProfitLossChart from "../../components/Pie"; // Pie Chart Component
import { tokens } from "../../theme";

const ProfitLossAnalysis = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [chartData, setChartData] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [cost, setCost] = useState(0);

  useEffect(() => {
    const getData = async () => {
      try {
        const { totalRevenue, totalCost } = await fetchTotalRevenueAndCost();

        // State'leri güncelle
        setRevenue(totalRevenue);
        setCost(totalCost);

        // Chart verilerini formatla
        const formattedChartData = [
          { id: "Revenue", value: totalRevenue.toFixed(2), color: "#4CAF50" }, // Yeşil
          { id: "Cost", value: totalCost.toFixed(2), color: "#F44336" }, // Kırmızı
        ];
        setChartData(formattedChartData);
      } catch (error) {
        console.error("Data fetching failed:", error);
      }
    };

    getData();
  }, []);

  // Profit ve Yüzdelik Hesaplama
  const profit = revenue - cost;
  const profitPercentage = revenue > 0 ? (profit / revenue) * 100 : 0;

  return (
    <Box m="20px">
      {/* Sayfa başlığı */}
      <Header title="Profit/Loss Analysis" subtitle="Overview of Revenue and Costs" />

      {/* Chart ve Bilgiler */}
      <Box display="flex" flexDirection="column" alignItems="center" mt="40px" gap="20px">
        {/* Pie Chart */}
        <Box width="50%">
          <ProfitLossChart data={chartData} />
        </Box>

        {/* Revenue, Cost, Profit ve Percentage - Yan Yana */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap="30px" // Kartlar arasında boşluk
          mt="20px"
        >
          <Typography variant="h6" color={colors.grey[100]}>
            <strong>Total Revenue:</strong> ${revenue.toFixed(2)}
          </Typography>
          <Typography variant="h6" color={colors.grey[100]}>
            <strong>Total Cost:</strong> ${cost.toFixed(2)}
          </Typography>
          <Typography variant="h6" color={colors.grey[100]}>
            <strong>Total Profit:</strong> ${profit.toFixed(2)}
          </Typography>
          <Typography variant="h6" color={colors.grey[100]}>
            <strong>Profit Percentage:</strong> {profitPercentage.toFixed(2)}%
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfitLossAnalysis;
