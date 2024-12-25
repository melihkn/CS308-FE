import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  Button,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fetchDiscounts, fetchProducts, createDiscount } from "../../smapi/smAPI";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Discounts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [tableData, setTableData] = useState([]); // Tablo verileri
  const [products, setProducts] = useState([]); // Ürün listesi
  const [loading, setLoading] = useState(true); // Yükleme durumu
  const [isModalOpen, setModalOpen] = useState(false); // Modal açık/kapalı durumu
  const [formValues, setFormValues] = useState({
    product_id: "",
    discount_rate: "",
    start_date: "",
    end_date: "",
  }); // Form verileri

  useEffect(() => {
    const getDiscountsAndProducts = async () => {
      try {
        // Ürünleri çek ve state'e ata
        const productsData = await fetchProducts();
        setProducts(productsData);

        // İndirimleri çek ve formatla
        const discountsData = await fetchDiscounts();
        const formattedData = discountsData.map((discount, index) => ({
          id: index + 1, // Benzersiz bir ID oluştur
          product_name: productsData.find(
            (product) => product.product_id === discount.product_id
          )?.name || "Unknown Product", // Ürün ismi eşleştir veya fallback
          discount_rate: discount.discount_rate,
          start_date: new Date(discount.start_date).toLocaleString(),
          end_date: new Date(discount.end_date).toLocaleString(),
        }));
        setTableData(formattedData);
        setLoading(false);
      } catch (error) {
        console.error("Veriler alınamadı:", error);
        setLoading(false);
      }
    };

    getDiscountsAndProducts();
  }, []);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleProductSelect = (e) => {
    setFormValues({ ...formValues, product_id: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await createDiscount(formValues);

      // İndirimleri yeniden çek ve tabloyu güncelle
      const updatedDiscounts = await fetchDiscounts();
      const formattedData = updatedDiscounts.map((discount, index) => ({
        id: index + 1,
        product_name: products.find(
          (product) => product.product_id === discount.product_id
        )?.name || "Unknown Product",
        discount_rate: discount.discount_rate,
        start_date: new Date(discount.start_date).toLocaleString(),
        end_date: new Date(discount.end_date).toLocaleString(),
      }));
      setTableData(formattedData);

      handleCloseModal(); // Modalı kapat
      setFormValues({
        product_id: "",
        discount_rate: "",
        start_date: "",
        end_date: "",
      }); // Formu sıfırla
    } catch (error) {
      console.error("Yeni indirim oluşturulamadı:", error);
    }
  };

  // DataGrid sütunları
  const columns = [
    { field: "product_name", headerName: "Product Name", flex: 1 },
    { field: "discount_rate", headerName: "Discount Rate (%)", flex: 1 },
    { field: "start_date", headerName: "Start Date", flex: 1 },
    { field: "end_date", headerName: "End Date", flex: 1 },
  ];

  return (
    <Box m="20px">
      <Header title="Discounts" subtitle="List of Discounts" />
      <Button
        variant="contained"
        color="secondary"
        onClick={handleOpenModal}
        sx={{ mb: 2 }}
      >
        Create Discount
      </Button>
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

      {/* Create Discount Modal */}
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
            Create Discount
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel id="product-select-label">Product</InputLabel>
            <Select
              labelId="product-select-label"
              value={formValues.product_id}
              onChange={handleProductSelect}
            >
              {products.map((product) => (
                <MenuItem key={product.product_id} value={product.product_id}>
                  {product.name} {/* Dropdown'da ürün ismi gösterilir */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Discount Rate"
            name="discount_rate"
            type="number"
            value={formValues.discount_rate}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Start Date"
            name="start_date"
            type="datetime-local"
            value={formValues.start_date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="End Date"
            name="end_date"
            type="datetime-local"
            value={formValues.end_date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Discounts;
