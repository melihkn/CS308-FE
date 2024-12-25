import { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fetchRefundsWithProductNames, updateRefundStatus } from "../../smapi/smAPI"; // API.js'den import
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Refunds = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [tableData, setTableData] = useState([]); // Tablo verileri
  const [loading, setLoading] = useState(true); // Yükleme durumu

  useEffect(() => {
    const getRefunds = async () => {
      try {
        const refundsData = await fetchRefundsWithProductNames(); // Yeni API fonksiyonunu kullan
        const formattedData = refundsData.map((refund, index) => ({
          id: index + 1, // Benzersiz bir ID oluştur
          refund_id: refund.refund_id,
          order_item_id: refund.order_item_id,
          order_id: refund.order_id,
          product_name: refund.product_name, // Ürün ismini burada kullan
          refund_amount: refund.refund_amount,
          status: refund.status,
          request_date: new Date(refund.request_date).toLocaleString(),
        }));
        setTableData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Veriler alınamadı:", error);
        setLoading(false);
      }
    };
  
    getRefunds();
  }, []);
  const handleUpdateStatus = async (refundId, newStatus) => {
    try {
      await updateRefundStatus(refundId, newStatus); // API.js'den gelen update fonksiyonu
      const updatedData = tableData.map((row) =>
        row.refund_id === refundId ? { ...row, status: newStatus } : row
      );
      setTableData(updatedData); // Yeni tablo verilerini güncelle
    } catch (error) {
      console.error("Durum güncellenemedi:", error);
    }
  };

  // DataGrid sütunları
  const columns = [
    { field: "refund_id", headerName: "Refund ID", flex: 1 },
    { field: "product_name", headerName: "Product Name", flex: 1 },
    { field: "order_id", headerName: "Order ID", flex: 1 },
    {
      field: "refund_amount",
      headerName: "Refund Amount ($)",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "request_date",
      headerName: "Request Date",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap="10px"sx={{
            paddingTop: "10px", // Hücre içeriğinin üstüne 10px boşluk ekler
          }}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleUpdateStatus(params.row.refund_id, "Approved")}
            
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleUpdateStatus(params.row.refund_id, "Rejected")}
          >
            Disapprove
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Refunds" subtitle="Manage Refunds" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
        }}
      >
        {loading ? (
          <Typography color="white">Loading...</Typography>
        ) : (
          <DataGrid rows={tableData} columns={columns} />
        )}
      </Box>
    </Box>
  );
};

export default Refunds;
