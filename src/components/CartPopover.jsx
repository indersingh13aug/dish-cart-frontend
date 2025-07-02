import React from "react";
import {
  Popover,
  Box,
  Typography,
  Button,
  IconButton,
  Input,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CartPopover({
  open,
  anchorEl,
  onClose,
  cart,
  updateQuantity,
  removeFromCart,
  totalCost,
  onCheckout,
}) {
  const cartGroupedByStore = cart.reduce((acc, item) => {
    if (!acc[item.store]) {
      acc[item.store] = [];
    }
    acc[item.store].push(item);
    return acc;
  }, {});

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <Box sx={{ p: 2, minWidth: 300 }}>
        <Typography variant="h6" gutterBottom>
          Your Cart
        </Typography>

        {cart.length === 0 ? (
          <Typography variant="body2">Cart is empty.</Typography>
        ) : (
          <>
            {Object.entries(cartGroupedByStore).map(([store, items]) => (
              <Box key={store} sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {store}
                </Typography>

                {items.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1,
                      mt: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <img
                        src={item.img}
                        alt={item.ingredient}
                        width={30}
                        height={30}
                        style={{ borderRadius: 4 }}
                      />
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {item.ingredient}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ₹{item.price} x {item.quantity}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          = ₹{item.price * item.quantity}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Input
                        size="small"
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            cart.findIndex(
                              (p) =>
                                p.ingredient === item.ingredient &&
                                p.brand === item.brand &&
                                p.store === item.store
                            ),
                            parseInt(e.target.value) || 1
                          )
                        }
                        sx={{ width: 50 }}
                      />
                      <IconButton
                        sx={{ p: 1.5 }}
                        size="small"
                        color="error"
                        onClick={() => {
                          removeFromCart(
                            cart.findIndex(
                              (p) =>
                                p.ingredient === item.ingredient &&
                                p.brand === item.brand &&
                                p.store === item.store
                            )
                          );
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
            <Typography sx={{ mt: 2, fontWeight: "bold" }}>
              Total: ₹{totalCost}
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              fullWidth
              onClick={onCheckout}
            >
              Checkout
            </Button>
          </>
        )}
      </Box>
    </Popover>
  );
}
