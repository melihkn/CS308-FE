import axios from "axios";

// Axios Global Config
axios.defaults.baseURL = "http://localhost:8003/SalesManager"; // Tüm endpoint'ler için temel URL

// Token eklemek için Axios Request Interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Token'i localStorage'dan alın (veya başka bir yerden)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Unauthorized olduğunda kullanıcıyı logout etmek için Response Interceptor
axios.interceptors.response.use(
  (response) => response, // Başarılı cevapları direkt dön
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized access detected. Logging out...");
      localStorage.removeItem("token"); // Token'i kaldırın
      window.location.href = "/login"; // Login sayfasına yönlendirin
    }
    return Promise.reject(error);
  }
);

// API fonksiyonları

// Müşteri verilerini çekmek için fonksiyon
export const fetchCustomers = async () => {
  try {
    const response = await axios.get("/customers");
    return response.data;
  } catch (error) {
    console.error("API'den veri alınırken bir hata oluştu:", error);
    throw error;
  }
};

export const fetchDiscounts = async () => {
  try {
    const response = await axios.get("/discounts");
    return response.data;
  } catch (error) {
    console.error("API'den veri alınırken bir hata oluştu:", error);
    throw error;
  }
};

// Yeni bir indirim oluştur
export const createDiscount = async (discountData) => {
  try {
    const response = await axios.post("/discounts", discountData);
    return response.data;
  } catch (error) {
    console.error("Yeni indirim oluşturulurken bir hata oluştu:", error);
    throw error;
  }
};

// Tüm ürünleri getir
export const fetchProducts = async () => {
  try {
    const response = await axios.get("/products");
    return response.data;
  } catch (error) {
    console.error("Ürünler alınırken bir hata oluştu:", error);
    throw error;
  }
};

export const setProductPriceAPI = async (productId, newPrice) => {
  try {
    const response = await axios.patch(`/products/${productId}/set-price`, {
      price: newPrice,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating product price:", error.response?.data || error.message);
    throw error;
  }
};

// Siparişleri getir
export const fetchOrders = async () => {
  try {
    const response = await axios.get(`/orders`);
    return response.data;
  } catch (error) {
    console.error("Siparişler alınırken bir hata oluştu:", error);
    throw error;
  }
};

// Sipariş öğelerini getir
export const fetchOrderItems = async () => {
  try {
    const response = await axios.get(`/orderItems`);
    return response.data;
  } catch (error) {
    console.error("Sipariş öğeleri alınırken bir hata oluştu:", error);
    throw error;
  }
};

// İadeleri getir
export const fetchRefunds = async () => {
  try {
    const response = await axios.get(`/refunds`);
    return response.data;
  } catch (error) {
    console.error("Refunds could not be fetched:", error);
    throw error;
  }
};

// Refund statüsünü güncelle (Approve veya Disapprove)
export const updateRefundStatus = async (refundId, status) => {
  try {
    const response = await axios.put(`/refunds/${refundId}/${status}`, { status });
    return response.data;
  } catch (error) {
    console.error("Refund status could not be updated:", error);
    throw error;
  }
};

// Sipariş öğelerini tarih bilgisiyle getir
export const fetchOrderItemsWithDates = async () => {
  try {
    const [orderItems, orders] = await Promise.all([fetchOrderItems(), fetchOrders()]);

    const orderMap = orders.reduce((map, order) => {
      map[order.order_id] = order.order_date;
      return map;
    }, {});

    return orderItems.map((item) => ({
      ...item,
      order_date: orderMap[item.order_id] || null,
    }));
  } catch (error) {
    console.error("Error fetching order items with dates:", error);
    throw error;
  }
};

// Kar/Zarar verilerini tarih aralığına göre getir
export const fetchProfitLossData = async (startDate = null, endDate = null) => {
  try {
    const [orderItemsData, productsData, refundsData] = await Promise.all([
      fetchOrderItemsWithDates(),
      fetchProducts(),
      fetchRefunds(),
    ]);

    const refundedOrderItemIds = refundsData
      .filter((refund) => refund.status === "Approved")
      .map((refund) => refund.order_item_id);

    let totalSales = 0;
    let totalCost = 0;

    orderItemsData.forEach((orderItem) => {
      const { order_item_id, product_id, price_at_purchase, quantity, order_date } = orderItem;

      if (startDate && endDate) {
        const itemDate = new Date(order_date);
        if (itemDate < new Date(startDate) || itemDate > new Date(endDate)) {
          return;
        }
      }

      if (refundedOrderItemIds.includes(order_item_id)) {
        return;
      }

      const product = productsData.find((p) => p.product_id === product_id);
      const productCost = product?.cost || 0;

      totalSales += price_at_purchase * quantity;
      totalCost += productCost * quantity;
    });

    return {
      total_sales: totalSales,
      total_cost: totalCost,
    };
  } catch (error) {
    console.error("Profit/Loss data could not be fetched:", error);
    throw error;
  }
};

// İade edilen ürünleri ürün isimleriyle birlikte getir
export const fetchRefundsWithProductNames = async () => {
  try {
    const [refundsData, orderItemsData, productsData] = await Promise.all([
      fetchRefunds(),
      fetchOrderItems(),
      fetchProducts(),
    ]);

    return refundsData.map((refund) => {
      const orderItemId = refund.order_item_id;
      const orderItem = orderItemsData.find((item) => item.order_item_id === orderItemId);
      const productId = orderItem?.product_id;
      const product = productsData.find((p) => p.product_id === productId);
      const productName = product?.name || "Unknown Product";

      return {
        ...refund,
        product_name: productName,
      };
    });
  } catch (error) {
    console.error("Refunds with Product Names could not be fetched:", error);
    throw error;
  }
};

// Toplam gelir ve maliyet verilerini getir
export const fetchTotalRevenueAndCost = async () => {
  try {
    const { total_sales, total_cost } = await fetchProfitLossData();
    return {
      totalRevenue: total_sales,
      totalCost: total_cost,
    };
  } catch (error) {
    console.error("Total Revenue and Cost data could not be fetched:", error);
    throw error;
  }
};

// Ürün bazında gelir ve maliyet verilerini getir
export const fetchProductRevenueAndCost = async (startDate = null, endDate = null) => {
  try {
    const [orderItems, products, refundsData] = await Promise.all([
      fetchOrderItemsWithDates(),
      fetchProducts(),
      fetchRefunds(),
    ]);

    const refundedOrderItemIds = refundsData
      .filter((refund) => refund.status === "Approved")
      .map((refund) => refund.order_item_id);

    return products.map((product) => {
      const productOrders = orderItems.filter((item) => {
        const itemDate = new Date(item.order_date);

        if (startDate && endDate) {
          if (itemDate < new Date(startDate) || itemDate > new Date(endDate)) {
            return false;
          }
        }

        return (
          item.product_id === product.product_id &&
          !refundedOrderItemIds.includes(item.order_item_id)
        );
      });

      const totalRevenue = productOrders.reduce(
        (acc, item) => acc + item.price_at_purchase * item.quantity,
        0
      );
      const totalCost = productOrders.reduce(
        (acc, item) => acc + product.cost * item.quantity,
        0
      );

      return {
        product_name: product.name,
        revenue: totalRevenue,
        cost: totalCost,
      };
    });
  } catch (error) {
    console.error("Error fetching product revenue and cost data:", error);
    throw error;
  }
};

// Özet analizi için gerekli verileri getir
export const fetchSummaryAnalysis = async (startDate = null, endDate = null) => {
  try {
    const [totalRevenueAndCost, productRevenueAndCost] = await Promise.all([
      fetchProfitLossData(startDate, endDate),
      fetchProductRevenueAndCost(startDate, endDate),
    ]);

    return {
      total: totalRevenueAndCost,
      products: productRevenueAndCost,
    };
  } catch (error) {
    console.error("Summary Analysis could not be fetched:", error);
    throw error;
  }
};
