// this will be changed later
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const CommentPage = () => {
  const { orderId } = useParams(); // Get the order ID from the URL
  const [comment, setComment] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to submit the comment
      await axios.post(`http://127.0.0.1:8004/api/comments`, {
        order_id: orderId,
        comment
      });
      setSuccessMessage("Your comment has been submitted successfully!");
      setComment(""); // Reset the comment field
    } catch (error) {
      console.error("Error submitting comment:", error);
      setSuccessMessage("An error occurred while submitting your comment.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Leave a Comment for Order {orderId}</h1>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment here..."
          style={{ width: "100%", height: "100px", marginBottom: "10px" }}
          required
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Submit Comment
        </button>
      </form>
    </div>
  );
};

export default CommentPage;
