import React, { useState, useEffect, useRef } from "react";
import axios from './services/axios';
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Input,
  Snackbar,
  Alert
} from "@mui/material";
import { motion } from "framer-motion";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [recipeName, setRecipeName] = useState(null);
  const [ingredients, setIngredients] = useState([]);

  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showBrands, setShowBrands] = useState(false);
  const [cart, setCart] = useState([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const chatBoxRef = useRef(null);

  const groceryBrands = [
    { brand: "India Gate", price: 120, weight: "1kg", store: "Amazon" },
    { brand: "Daawat", price: 100, weight: "1kg", store: "JioMart" },
    { brand: "Organic Choice", price: 140, weight: "500g", store: "Flipkart" },
  ];

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: input }
    ]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "/chat",
        {
          user_id: "guest",
          user_message: input,
        }
      );

      let data = response.data;

      if (data.assistant_message) {
        data = JSON.parse(data.assistant_message);
      }

      console.log(data.recipe_name); // ✅ Now this works

      // If backend returned raw text fallback
      if (typeof data === "string") {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data }
        ]);
      } else {
        // Display recipe name
        setRecipeName(data.recipe_name);
        setIngredients(data.ingredients);

        setMessages((prev) => [
          ...prev,
          { role: "bot", content: `🍽️ ${data.recipe_name}` }
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Oops, something went wrong." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const addToCart = (brand) => {
    const item = {
      ...brand,
      ingredient: selectedIngredient.name,
      img: selectedIngredient.image_url,
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
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: "16px"
    }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box
          ref={chatBoxRef}
          sx={{
            height: 500,
            overflowY: "auto",
            mb: 2,
            pr: 1,
          }}
        >
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    bgcolor:
                      msg.role === "user" ? "#1976d2" : "#f5f5f5",
                    color: msg.role === "user" ? "white" : "black",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "75%",
                    overflowWrap: "break-word",
                  }}
                >
                  <Typography variant="body1">
                    {msg.content}
                  </Typography>
                </Box>
              </Box>
            </motion.div>
          ))}

          {recipeName && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" color="primary">
                Ingredients for {recipeName}
              </Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {ingredients.map((ing, i) => (
                  <Grid item xs={4} sm={3} md={2} key={i}>
                    <Box
                      onClick={() => {
                        setSelectedIngredient(ing);
                        setShowBrands(true);
                      }}
                      sx={{
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        "&:hover": {
                          transform: "scale(1.05)",
                          transition: "0.3s",
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          border: "1px solid #ddd",
                          overflow: "hidden",
                          borderRadius: 1,
                        }}
                      >
                        <img
                          src={ing.image_url}
                          style={{ width: 20, height: 20, objectFit: "cover" }}
                          alt={ing.name}
                        />
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{ mt: 1, textAlign: "center" }}
                      >
                        {ing.name}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            variant="outlined"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What would you like to cook today?"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
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
            Send
          </Button>
          {loading && <CircularProgress size={24} />}
        </Box>
      </Paper>

      {cart.length > 0 && (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6">🛒 Cart</Typography>
          {cart.map((item, idx) => (
            <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <img src={item.img} width={30} height={30} alt="" />
              <Typography>{item.brand} {item.ingredient}</Typography>
              <Input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(idx, parseInt(e.target.value) || 1)
                }
                sx={{ width: 60 }}
              />
              <Typography>₹{item.price * item.quantity}</Typography>
              <Button size="small" onClick={() => removeFromCart(idx)}>
                Remove
              </Button>
            </Box>
          ))}
          <Typography sx={{ mt: 2 }}>Total: ₹{totalCost}</Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => setCheckoutOpen(true)}
          >
            Checkout
          </Button>
        </Paper>
      )}

      <Dialog open={showBrands} onClose={() => setShowBrands(false)}>
        <DialogTitle>Select Brand for {selectedIngredient?.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            {groceryBrands.map((brand, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Card>
                  <CardMedia
                    image={selectedIngredient?.image_url}
                    sx={{ height: 100 }}
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

      <Dialog open={checkoutOpen} onClose={() => setCheckoutOpen(false)}>
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
              setCart([]);
            }}
          >
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={paymentSuccess}
        autoHideDuration={4000}
        onClose={() => setPaymentSuccess(false)}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Payment completed successfully! 🎉
        </Alert>
      </Snackbar>
    </div>
  );
}
