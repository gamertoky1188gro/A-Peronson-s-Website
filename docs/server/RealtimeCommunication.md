# Realtime Communication (WebSocket)

Primary file: `server/server.js`

This server hosts a WebSocket server (ws) used by chat/calls/assistant.

## Key sections

### Server bootstrap (excerpt)

```js
import "./utils/dotenv.js";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import http from "http";
import { WebSocketServer } from "ws";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import requirementRoutes from "./routes/requirementRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import systemRoutes from "./routes/systemRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import socialRoutes from "./routes/socialRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import presetsRoutes from "./routes/presetsRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import feedRoutes from "./routes/feedRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import onboardingRoutes from "./routes/onboardingRoutes.js";
import assistantRoutes from "./routes/assistantRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import partnerNetworkRoutes from "./routes/partnerNetworkRoutes.js";
import agentSubIdRoutes from "./routes/agentSubIdRoutes.js";
import callSessionRoutes from "./routes/callSessionRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import orgRoutes from "./routes/orgRoutes.js";
import ratingsRoutes from "./routes/ratingsRoutes.js";
import presenceRoutes from "./routes/presenceRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import chatbotRoutes from "./routes/chatbotRoutes.js";
import walletRoutes from "./routes/walletRoutes.js";
import boostRoutes from "./routes/boostRoutes.js";
import geoRoutes from "./routes/geoRoutes.js";
```
