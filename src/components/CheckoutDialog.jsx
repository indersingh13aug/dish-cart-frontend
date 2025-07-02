import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

export default function CheckoutDialog({
  open,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>Checkout</DialogTitle>
      <DialogContent>
        <Typography>Complete your order.</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onConfirm}>
          Pay Now
        </Button>
      </DialogActions>
    </Dialog>
  );
}
