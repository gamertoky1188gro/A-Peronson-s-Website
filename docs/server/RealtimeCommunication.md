# Realtime Communication (WebSocket)

Primary file: `server/server.js`

This server hosts a WebSocket server (ws) used by chat/calls/assistant.

## Key sections

### Server bootstrap (excerpt)

```js
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import http from 'http'
import { WebSocketServer } from 'ws'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import requirementRoutes from './routes/requirementRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import systemRoutes from './routes/systemRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import socialRoutes from './routes/socialRoutes.js'
import searchRoutes from './routes/searchRoutes.js'
import verificationRoutes from './routes/verificationRoutes.js'
import subscriptionRoutes from './routes/subscriptionRoutes.js'
import feedRoutes from './routes/feedRoutes.js'
import productRoutes from './routes/productRoutes.js'
import onboardingRoutes from './routes/onboardingRoutes.js'
import assistantRoutes from './routes/assistantRoutes.js'
import conversationRoutes from './routes/conversationRoutes.js'
import analyticsRoutes from './routes/analyticsRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import partnerNetworkRoutes from './routes/partnerNetworkRoutes.js'
import callSessionRoutes from './routes/callSessionRoutes.js'
import memberRoutes from './routes/memberRoutes.js'
import orgRoutes from './routes/orgRoutes.js'
import ratingsRoutes from './routes/ratingsRoutes.js'
import presenceRoutes from './routes/presenceRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { logInfo, logError } from './utils/logger.js'
import { assistantReply } from './services/assistantService.js'
import jwt from 'jsonwebtoken'
import { canAccessMatch, listMessagesByMatch, postMessage } from './services/messageService.js'
import { getCallSession } from './services/callSessionService.js'
import { setUserOnline, setUserOffline, touchUser } from './services/presenceService.js'
import { readJson } from './utils/jsonStore.js'
import { consumePendingInvites, enqueuePendingInvites } from './utils/pendingInvites.js'
```
