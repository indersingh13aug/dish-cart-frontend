import React, { useState, useEffect, useRef } from "react";
import axios from './services/axios';
import {
    TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = "guest";
  const chatBoxRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to history
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input },
    ]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "/v1/chat",
        {
          user_id: userId,
          user_message: input,
        }
      );

      // Response now returns HTML string directly
      const content = response.data.assistant_message;

      const botMessage = {
        role: "bot",
        content,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Oops, something went wrong.",
        },
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

  return (
    <div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
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
                  {msg.role === "bot" ? (
                    <Typography
                      variant="body1"
                      component="div"
                      dangerouslySetInnerHTML={{ __html: msg.content }}
                    />
                  ) : (
                    <Typography variant="body1">
                      {msg.content}
                    </Typography>
                  )}
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            variant="outlined"
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
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
    </div>
  );
}
