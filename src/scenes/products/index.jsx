import { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button, Modal, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fetchProducts, setProductPriceAPI } from "../../smapi/smAPI"; // API fonksiyonlarını içeren dosya
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Products = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [tableData, setTableData] = useState([]); // Satır verileri
  const [loading, setLoading] = useState(true); // Yüklenme durumu
  const [isModalOpen, setModalOpen] = useState(false); // Modal durumu
  const [selectedProduct, setSelectedProduct] = useState(null); // Seçili ürün
  const [newPrice, setNewPrice] = useState(""); // Yeni fiyat

  // API'den ürün verilerini çekme
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        const formattedData = data.map((product, index) => ({
          id: product.product_id, // DataGrid için benzersiz id
          name: product.name,
          model: product.model,
          description: product.description,
          quantity: product.quantity,
          price: parseFloat(product.price).toFixed(2),
          warranty_status: `${product.warranty_status} months`,
          distributor: product.distributor,
        }));
        setTableData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Ürün verileri alınamadı:", error);
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  // DataGrid sütunları
  const columns = [
    { field: "name", headerName: "Product Name", flex: 1 },
    { field: "model", headerName: "Model", flex: 1 },
    { field: "description", headerName: "Description", flex: 2 },
    { field: "quantity", headerName: "Quantity", type: "number", flex: 1 },
    { field: "price", headerName: "Price ($)", type: "number", flex: 1 },
    { field: "warranty_status", headerName: "Warranty", flex: 1 },
    { field: "distributor", headerName: "Distributor", flex: 1 },
    {
      field: "set_price",
      headerName: "Set Price",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleOpenModal(params.row)}
        >
          Set Price
        </Button>
      ),
    },
  ];

  // Modal işlemleri
  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setNewPrice("");
    setModalOpen(false);
  };

  const handleSetPrice = async () => {
    if (!newPrice || isNaN(newPrice)) {
      alert("Please enter a valid price!");
      return;
    }

    try {
      await setProductPriceAPI(selectedProduct.id, parseFloat(newPrice)); // API çağrısı
      // Tabloyu güncelle
      setTableData((prevData) =>
        prevData.map((product) =>
          product.id === selectedProduct.id ? { ...product, price: parseFloat(newPrice).toFixed(2) } : product
        )
      );
      handleCloseModal();
    } catch (error) {
      console.error("Fiyat güncellenemedi:", error);
      alert("Failed to update price. Please try again.");
    }
  };

  return (
    <Box m="20px">
      <Header title="Products" subtitle="List of Products" />
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

      {/* Set Price Modal */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          p={4}
          sx={{
            backgroundColor: colors.primary[500],
            color: colors.grey[100],
            width: 400,
            margin: "100px auto",
            borderRadius: "8px",
          }}
        >
          <Typography variant="h6" mb={2}>
            Set Price for {selectedProduct?.name}
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="New Price ($)"
            type="number"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSetPrice}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Products;
