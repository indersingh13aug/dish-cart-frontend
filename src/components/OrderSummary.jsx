import React from "react";
import { Container, Typography, Paper } from "@mui/material";

export default function OrderSummary({ lastOrder }) {
  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, sm: 4 }, mb: { xs: 4, sm: 10 } }}>
      <Typography variant="h5" gutterBottom>
        Your Last Order
      </Typography>

      <Paper sx={{ overflowX: "auto" }}>
        <Box component="table" sx={{ minWidth: 500 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Brand</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Ingredient</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Quantity</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Price</th>
              <th style={{ padding: 8, border: "1px solid #ddd" }}>Source</th>
            </tr>
          </thead>
          <tbody>
            {lastOrder.items.map((item, idx) => (
              <tr key={idx}>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>{item.brand}</td>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>{item.ingredient}</td>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>{item.quantity}</td>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>
                  ₹{item.price * item.quantity}
                </td>
                <td style={{ padding: 8, border: "1px solid #ddd" }}>{item.store}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} style={{ padding: 8, fontWeight: "bold", border: "1px solid #ddd" }}>
                Grand Total
              </td>
              <td style={{ padding: 8, fontWeight: "bold", border: "1px solid #ddd" }}>
                ₹{lastOrder.total}
              </td>
              <td style={{ border: "1px solid #ddd" }}></td>
            </tr>
          </tbody>
        </table>
        </Box>
      </Paper>
    </Container>
  );
}
