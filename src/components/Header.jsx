import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  Badge,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import HistoryIcon from "@mui/icons-material/History";

export default function Header({
  input,
  setInput,
  sendMessage,
  loading,
  handleCartClick,
  cartCount,
  toggleOrderSummary,
}) {
  return (
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
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            gap: 1,
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendMessage();
            }
          }}
        />

        <Button variant="contained" onClick={sendMessage} disabled={loading}>
          Search
        </Button>
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 2 }}>
          <IconButton sx={{ p: 1.5 }} onClick={handleCartClick}>
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <IconButton sx={{ p: 1.5 }} color="secondary" onClick={toggleOrderSummary}>
            <HistoryIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
