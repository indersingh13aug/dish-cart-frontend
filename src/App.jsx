import React, { useState } from "react";
import axios from "./services/axios";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import Header from "./components/Header";
import RecipeDetails from "./components/RecipeDetails";
import OrderSummary from "./components/OrderSummary";
import BrandDialog from "./components/BrandDialog";
import CheckoutDialog from "./components/CheckoutDialog";
import CartPopover from "./components/CartPopover";

import placeholder from "./assets/ingredients/placeholder.jpg";

// Load all images in the ingredients folder
const images = import.meta.glob("./assets/ingredients/*.jpg", { eager: true });

export default function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipeName, setRecipeName] = useState(null);
  const [instructions, setInstructions] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [showBrands, setShowBrands] = useState(false);
  const [cart, setCart] = useState([]);
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [lastOrder, setLastOrder] = useState(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const cartOpen = Boolean(cartAnchorEl);

  const groceryBrands = [
    { brand: "India Gate", price: 120, weight: "1kg", store: "Amazon" },
    { brand: "Daawat", price: 100, weight: "1kg", store: "JioMart" },
    { brand: "Organic Choice", price: 140, weight: "500g", store: "Flipkart" },
  ];

  const getIngredientImage = (name) => {
    if (!name) return placeholder;
    const fileName = name.toLowerCase().replace(/\s+/g, "") + ".jpg";
    const path = `./assets/ingredients/${fileName}`;
    return images[path]?.default || placeholder;
  };

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
    } catch (err) {
      console.error(err);
      setRecipeName(null);
      setInstructions([]);
      setIngredients([]);
    } finally {
      setLoading(false);
    }
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
      prev.map((item, i) => (i === index ? { ...item, quantity: qty } : item))
    );
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const totalCost = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCartClick = (event) => {
    setCartAnchorEl(event.currentTarget);
  };

  const handleCartClose = () => {
    setCartAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header Bar */}
      <Header
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        loading={loading}
        handleCartClick={handleCartClick}
        cartCount={cart.length}
        toggleOrderSummary={() => {
          if (lastOrder) setShowOrderSummary((prev) => !prev);
        }}
      />

      {/* Spacing under AppBar */}
      <Toolbar />

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && recipeName && (
          <RecipeDetails
            recipeName={recipeName}
            instructions={instructions}
            ingredients={ingredients}
            onIngredientClick={(ing) => {
              setSelectedIngredient(ing);
              setShowBrands(true);
            }}
            getIngredientImage={getIngredientImage}
          />
        )}

        {!loading && !recipeName && (
          <Typography sx={{ mt: 8, textAlign: "center" }}>
            Search for a recipe to see results!
          </Typography>
        )}
      </Container>

      {/* Last Order Table */}
      {showOrderSummary && lastOrder && (
        <OrderSummary lastOrder={lastOrder} />
      )}

      {/* Brand Dialog */}
      <BrandDialog
        open={showBrands}
        onClose={() => setShowBrands(false)}
        ingredient={selectedIngredient}
        brands={groceryBrands}
        getIngredientImage={getIngredientImage}
        addToCart={addToCart}
      />

      {/* Checkout Dialog */}
      <CheckoutDialog
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onConfirm={() => {
          setCheckoutOpen(false);
          setPaymentSuccess(true);
          setLastOrder({ items: cart, total: totalCost });
          setCart([]);
          setRecipeName(null);
          setInstructions([]);
          setIngredients([]);
        }}
      />

      {/* Payment Success Toast */}
      <Snackbar
        open={paymentSuccess}
        autoHideDuration={3000}
        onClose={() => setPaymentSuccess(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Payment completed successfully!
        </Alert>
      </Snackbar>

      {/* Floating Cart Popover */}
      <CartPopover
        open={cartOpen}
        anchorEl={cartAnchorEl}
        onClose={handleCartClose}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        totalCost={totalCost}
        onCheckout={() => {
          setCheckoutOpen(true);
          handleCartClose();
        }}
      />
    </Box>
  );
}
