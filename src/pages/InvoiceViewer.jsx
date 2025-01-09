import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const InvoiceViewer = () => {
    const {invoiceId} = useParams();
    const [invoiceData, setInvoiceData] = useState(null);
    const [pdfUrl, setPdfUrl] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchInvoice();
    }, []);

    
    const fetchInvoice = async () => {
        try {
        // Replace this with the actual backend URL
        console.log("invoiceId: ", invoiceId);
        const baseUrl = "http://127.0.0.1:8004"; // Replace with your FastAPI URL
        const response = await fetch(`${baseUrl}/api/orders/invoice/${invoiceId}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch the invoice");
        }

        // Create a blob URL for the PDF
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        } catch (err) {
        setError(err.message);
        }
    };
   

    return (
        <div>
          
          <iframe
            src={pdfUrl}
            title="Invoice PDF"
            style={{ width: "100%", height: "80vh" }}
            frameBorder="0"
          />
        </div>
      );
};

export default InvoiceViewer;
