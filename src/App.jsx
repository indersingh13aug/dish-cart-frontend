import React, { useState, useEffect } from "react";
import axios from "./services/axios";
import placeholder from "./assets/ingredients/placeholder.jpg";

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Button,
  Container,
  Grid,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Input,
  Snackbar,
  Alert,
} from "@mui/material";

const images = import.meta.glob("./assets/ingredients/*.jpg", {
  eager: true,
});

export default function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [recipeName, setRecipeName] = useState(null);
  const [instructions, setInstructions] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showBrands, setShowBrands] = useState(false);
  const [cart, setCart] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const groceryBrands = [
    { brand: "India Gate", price: 120, weight: "1kg", store: "Amazon" },
    { brand: "Daawat", price: 100, weight: "1kg", store: "JioMart" },
    { brand: "Organic Choice", price: 140, weight: "500g", store: "Flipkart" },
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const response = await axios.post("/chat", {
        user_id: "guest",
        user_message: input,
      });

      let data = response.data;

      if (data.assistant_message) {
        data = JSON.parse(data.assistant_message);
      }

      if (typeof data === "string") {
        setRecipeName(null);
        setInstructions([]);
        setIngredients([]);
      } else {
        setRecipeName(data.recipe_name);
        setInstructions(data.instructions || []);
        setIngredients(data.ingredients || []);
      }
    } catch (error) {
      console.error(error);
      setRecipeName(null);
      setInstructions([]);
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  const getIngredientImage = (name) => {
    if (!name) return placeholder;
    const fileName = name
      .toLowerCase()
      .replace(/\s+/g, "") + ".jpg";
    const path = `./assets/ingredients/${fileName}`;
    return images[path]?.default || placeholder;
  };

  const addToCart = (brand) => {
    const item = {
      ...brand,
      ingredient: selectedIngredient.name,
      img: getIngredientImage(selectedIngredient.name),
      quantity: 1,
    };

    setCart((prev) => {
      const existing = prev.find(
        (p) => p.ingredient === item.ingredient && p.brand === item.brand
      );
      if (existing) {
        return prev.map((p) =>
          p.ingredient === item.ingredient && p.brand === item.brand
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      } else {
        return [...prev, item];
      }
    });

    setShowBrands(false);
  };

  const updateQuantity = (index, qty) => {
    setCart((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, quantity: qty } : item
      )
    );
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const totalCost = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* HEADER */}
      <AppBar position="fixed">
        <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Recipe Finder
          </Typography>
          <TextField
            size="small"
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search recipes..."
            sx={{
              backgroundColor: "white",
              borderRadius: 1,
              minWidth: { xs: "150px", sm: "250px" },
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={loading}
          >
            Search
          </Button>
        </Toolbar>
      </AppBar>

      {/* SPACE BELOW HEADER */}
      <Toolbar />

      {/* PAGE CONTENT */}
      <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && recipeName && (
          <>
            <Typography
              variant="h4"
              sx={{ textAlign: "center", mb: 3 }}
            >
              {recipeName}
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Instructions:
              </Typography>
              <ol>
                {instructions.map((step, i) => (
                  <li key={i}>
                    <Typography variant="body2">{step}</Typography>
                  </li>
                ))}
              </ol>
            </Box>

            <Typography variant="h6" gutterBottom>
              Ingredients:
            </Typography>

            <Grid container spacing={2}>
              {ingredients.map((ing, i) => (
                <Grid item xs={12} key={i}>
                  <Paper
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 2,
                      gap: 2,
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                    onClick={() => {
                      setSelectedIngredient(ing);
                      setShowBrands(true);
                    }}
                  >
                    <img
                      src={getIngredientImage(ing.name)}
                      alt={ing.name}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    <Typography
                      sx={{
                        flexGrow: 1,
                        fontWeight: "bold",
                        fontSize: { xs: "1rem", sm: "1.2rem" },
                      }}
                    >
                      {ing.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: "text.secondary",
                        minWidth: "100px",
                        textAlign: "right",
                      }}
                    >
                      {ing.quantity}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {!loading && !recipeName && (
          <Typography sx={{ mt: 8, textAlign: "center" }}>
            Search for a recipe to see results!
          </Typography>
        )}
      </Container>
      {showOrderSummary && lastOrder && (
  <Container maxWidth="md" sx={{ mt: 4 }}>
    <Typography variant="h5" gutterBottom>
      Your Last Order
    </Typography>

    <Paper sx={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <thead style={{ background: "#1976d2", color: "#fff" }}>
          <tr>
            <th style={{ padding: "8px" }}>Brand</th>
            <th style={{ padding: "8px" }}>Ingredient</th>
            <th style={{ padding: "8px" }}>Quantity</th>
            <th style={{ padding: "8px" }}>Price</th>
            <th style={{ padding: "8px" }}>Source</th>
          </tr>
        </thead>
        <tbody>
          {lastOrder.items.map((item, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "8px" }}>{item.brand}</td>
              <td style={{ padding: "8px" }}>{item.ingredient}</td>
              <td style={{ padding: "8px" }}>{item.quantity}</td>
              <td style={{ padding: "8px" }}>₹{item.price * item.quantity}</td>
              <td style={{ padding: "8px" }}>{item.store}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Paper>

    <Typography
      variant="h6"
      sx={{ textAlign: "right", mt: 2 }}
    >
      Grand Total: ₹{lastOrder.total}
    </Typography>
  </Container>
)}

      {/* CART PANEL */}
      {cart.length > 0 && (
        <Paper
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            zIndex: 999,
          }}
          elevation={3}
        >
          <Typography variant="h6">🛒 Cart</Typography>
          {cart.map((item, idx) => (
            <Box
              key={idx}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                my: 1,
                flexWrap: "wrap",
              }}
            >
              <img
                src={item.img}
                width={30}
                height={30}
                alt=""
                style={{ borderRadius: 4 }}
              />
              <Typography sx={{ flexGrow: 1 }}>
                {item.brand} - {item.ingredient}
              </Typography>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(idx, parseInt(e.target.value) || 1)
                }
                sx={{ width: 60 }}
              />
              <Typography>₹{item.price * item.quantity}</Typography>
              <Button
                size="small"
                onClick={() => removeFromCart(idx)}
              >
                Remove
              </Button>
            </Box>
          ))}
          <Typography sx={{ mt: 1 }}>
            Total: ₹{totalCost}
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setCheckoutOpen(true)}
          >
            Checkout
          </Button>
        </Paper>
      )}

      {/* BRAND SELECTION DIALOG */}
      <Dialog open={showBrands} onClose={() => setShowBrands(false)}>
        <DialogTitle>Select Brand for {selectedIngredient?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {groceryBrands.map((brand, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card>
                  <CardMedia
                    component="img"
                    height="100"
                    image={getIngredientImage(selectedIngredient?.name)}
                  />
                  <CardContent>
                    <Typography>{brand.brand}</Typography>
                    <Typography>₹{brand.price}</Typography>
                    <Typography>{brand.weight}</Typography>
                    <Typography>{brand.store}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => addToCart(brand)}
                    >
                      Add to Cart
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>

      {/* CHECKOUT */}
      <Dialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      >
        <DialogTitle>Checkout</DialogTitle>
        <DialogContent>
          <Typography>Complete your order.</Typography>
        </DialogContent>
        <DialogActions>
          <Button
  variant="contained"
  onClick={() => {
    setCheckoutOpen(false);
    setPaymentSuccess(true);

    // Save order details
    setLastOrder({
      items: cart,
      total: totalCost,
    });

    // Clear all data
    setCart([]);
    setRecipeName(null);
    setInstructions([]);
    setIngredients([]);
  }}
>
  Pay Now
</Button>

        </DialogActions>
      </Dialog>

      <Snackbar
        open={paymentSuccess}
        autoHideDuration={3000}
        onClose={() => setPaymentSuccess(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Payment completed successfully! 🎉
        </Alert>
      </Snackbar>
      {paymentSuccess && (
  <Box sx={{ mt: 4, textAlign: "center" }}>
    <Button
      variant="contained"
      onClick={() => setShowOrderSummary(true)}
    >
      View My Order
    </Button>
  </Box>
)}

    </Box>
  );
}
