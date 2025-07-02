import React from "react";
import { Typography, Box, Grid, Paper } from "@mui/material";
import { useTheme } from "@mui/material/styles";


export default function RecipeDetails({
  
  recipeName,
  instructions,
  ingredients,
  onIngredientClick,
  getIngredientImage,
}) {
  const theme = useTheme();
  return (
    
    <>
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3, fontSize: { xs: "1.5rem", sm: "2.125rem" } }}>
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
          <Grid item xs={12} sm={6} md={4} key={i}>
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
              onClick={() => onIngredientClick(ing)}
            >
              <img
                src={getIngredientImage(ing.name)}
                alt={ing.name}
                style={{
                  width: 60,
                  height: 60,
                  objectFit: "cover",
                  borderRadius: 4,
                  [theme.breakpoints.down("sm")]: {
                    width: 40,
                    height: 40,
                  },
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
  );
}
