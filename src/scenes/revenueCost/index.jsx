import { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { fetchProductRevenueAndCost } from "../../api/smAPI"; // API fonksiyonu
import Header from "../../components/Header";
import RevenueCostBarChart from "../../components/Bar"; // Bar Chart Component
import { tokens } from "../../theme";

const RevenueCostPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [barData, setBarData] = useState([]);
  const [profitData, setProfitData] = useState([]); // Profit verileri için state
  const [startDate, setStartDate] = useState(null); // Başlangıç tarihi
  const [endDate, setEndDate] = useState(null); // Bitiş tarihi

  const getData = async () => {
    try {
      const data = await fetchProductRevenueAndCost(
        startDate ? startDate.toISOString() : null,
        endDate ? endDate.toISOString() : null
      );

      // Bar chart için verileri formatlama
      const formattedBarData = data.map((item) => ({
        product_name: item.product_name,
        revenue: parseFloat(item.revenue.toFixed(2)),
        cost: parseFloat(item.cost.toFixed(2)),
      }));
      setBarData(formattedBarData);

      // Profit verilerini hesaplama
      const calculatedProfitData = data.map((item) => ({
        product_name: item.product_name,
        profit: (item.revenue - item.cost).toFixed(2),
      }));
      setProfitData(calculatedProfitData);
    } catch (error) {
      console.error("Failed to fetch revenue and cost data:", error);
    }
  };

  // İlk yüklemede ve tarih değiştiğinde verileri getir
  useEffect(() => {
    getData();
  }, [startDate, endDate]);

  const handleClearFilters = async () => {
    setStartDate(null);
    setEndDate(null);
  
    // Tüm verileri yeniden yükle
    try {
      const data = await fetchProductRevenueAndCost(); // Tüm verileri getir
      setBarData(
        data.map((item) => ({
          product_name: item.product_name,
          revenue: parseFloat(item.revenue.toFixed(2)),
          cost: parseFloat(item.cost.toFixed(2)),
        }))
      );
  
      setProfitData(
        data.map((item) => ({
          product_name: item.product_name,
          profit: (item.revenue - item.cost).toFixed(2),
        }))
      );
    } catch (error) {
      console.error("Failed to fetch revenue and cost data:", error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box m="20px">
        {/* Header */}
        <Header title="Revenue and Cost Analysis" subtitle="Compare Revenue and Cost per Product" />

        {/* Tarih Seçici ve Clear Button */}
        <Box display="flex" gap="20px" mb={4} alignItems="center">
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
          <Button variant="contained" color="secondary" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </Box>

        {/* Bar Chart */}
        <Box
          mt="20px"
          height="70vh"
          sx={{
            backgroundColor: colors.primary[400],
            borderRadius: "8px",
            padding: "20px",
          }}
        >
          {barData.length > 0 ? (
            <RevenueCostBarChart data={barData} />
          ) : (
            <Typography variant="h6" color={colors.grey[100]}>
              Loading...
            </Typography>
          )}
        </Box>

        {/* Profit List */}
        <Box mt="20px">
          <Typography variant="h5" color={colors.grey[100]} fontWeight="bold" mb="10px">
            Profit Per Product:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap="15px">
            {profitData.map((item, index) => (
              <Typography
                key={index}
                variant="body1"
                color={colors.grey[100]}
                sx={{
                  backgroundColor: colors.primary[400],
                  padding: "10px 15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                <strong>{item.product_name}:</strong> ${item.profit}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default RevenueCostPage;
