import { useEffect, useState } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fetchCustomers } from "../../smapi/smAPI"; // API isteklerini yapan fonksiyon
import EditIcon from "@mui/icons-material/Edit";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [tableData, setTableData] = useState([]); // Satır verileri
  const [loading, setLoading] = useState(true);  // Yüklenme durumu

  // API'den veri çekme
  useEffect(() => {
    const getCustomers = async () => {
      try {
        const data = await fetchCustomers(); // Axios ile veri çek
        const formattedData = data.map((customer) => ({
          id: customer.user_id, // `user_id`'yi `id` olarak ayarla
          name: customer.name,
          middlename: customer.middlename,
          surname: customer.surname,
          email: customer.email,
          phone_number: customer.phone_number,
        }));
        setTableData(formattedData); // Veriyi tabloya gönder
        setLoading(false);
      } catch (error) {
        console.error("Müşteri verileri alınamadı:", error);
        setLoading(false);
      }
    };

    getCustomers();
  }, []);

  // DataGrid sütunları
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "middlename", headerName: "Middle Name", flex: 1 },
    { field: "surname", headerName: "Surname", flex: 1 },
    { field: "email", headerName: "E-Mail", flex: 1 },
    { field: "phone_number", headerName: "Phone Number", flex: 1 },
    {
      field: "edit",
      headerName: "Actions",
      renderCell: () => (
        <Box
          width="80%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          backgroundColor={colors.greenAccent[600]}
          borderRadius="4px"
          style={{
            marginTop: "10px", // Yukarıdan 5px boşluk bırak
          }}
        >
          <EditIcon />
          <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
            {"Edit"}
          </Typography>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Customers" subtitle="List of Customers" />
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
        {/* Yüklenme durumu */}
        {loading ? (
          <Typography color="white">Loading...</Typography>
        ) : (
          <DataGrid rows={tableData} columns={columns} />
        )}
      </Box>
    </Box>
  );
};

export default Contacts;
