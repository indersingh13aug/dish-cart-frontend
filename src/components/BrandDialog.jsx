import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";


export default function BrandDialog({
  
  open,
  onClose,
  ingredient,
  brands,
  getIngredientImage,
  addToCart,
}) {
  const theme = useTheme();
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select Brand for {ingredient?.name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {brands.map((brand, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="100"
                  image={getIngredientImage(ingredient?.name)}
                  sx={{
                    objectFit: "contain",
                    [theme.breakpoints.down("sm")]: {
                      height: 80,
                    },
                  }}
                />
                <CardContent>
                  <Typography variant="subtitle1">{brand.brand}</Typography>
                  <Typography>₹{brand.price}</Typography>
                  <Typography>{brand.weight}</Typography>
                  <Typography>{brand.store}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => addToCart(brand)}>
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );
}
