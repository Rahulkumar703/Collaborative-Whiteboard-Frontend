# Collaborative Paint App - Frontend

A real-time collaborative drawing application built with React, Vite, and Socket.IO. Multiple users can draw together on a shared canvas with live cursor tracking and drawing synchronization.

## 🎨 Features

- **Real-time Collaboration**: Draw together with multiple users simultaneously
- **Live Cursor Tracking**: See other users' cursors in real-time
- **Room-based Sessions**: Join rooms using 6-character room codes
- **Drawing Tools**: Color picker, brush size adjustment, and canvas clearing
- **Responsive Design**: Works on desktop and mobile devices
- **User Management**: Track active users and their nicknames
- **Drawing History**: Maintains drawing state across sessions

## 🏗️ Architecture Overview

### High-Level System Design

```
┌─────────────────┐    WebSocket    ┌─────────────────┐
│   Frontend      │ ◄─────────────► │    Backend      │
│   (React)       │                 │   (Node.js)     │
└─────────────────┘                 └─────────────────┘
         │                                   │
         │ HTTP/REST                        │
         ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│   Room API      │                 │   Database      │
│   (Axios)       │                 │   (MongoDB)     │
└─────────────────┘                 └─────────────────┘
```

### Frontend Architecture

- **React 19**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Socket.IO Client**: Real-time communication with backend
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives

### Key Components

- `Whiteboard`: Main drawing canvas with real-time collaboration
- `Toolbar`: Drawing tools (color, brush size, clear)
- `UserCursors`: Live cursor tracking for other users
- `RoomPage`: Room joining and management
- `HomePage`: Landing page with room creation/joining

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend server running (see backend documentation)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd collaborative-paint/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   VITE_BACKEND_URL=http://localhost:3001
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🏗️ Component Architecture

### Core Components

#### Whiteboard Component

- **Purpose**: Main drawing canvas with real-time collaboration
- **Props**: `roomId` (string)
- **Features**:
  - Canvas drawing with mouse events
  - Real-time drawing synchronization
  - Cursor tracking
  - Drawing history management

#### Toolbar Component

- **Purpose**: Drawing tools and controls
- **Props**:
  - `onColorChange` (function)
  - `onWidthChange` (function)
  - `onClearCanvas` (function)
  - `currentColor` (string)
  - `currentWidth` (number)

#### UserCursors Component

- **Purpose**: Display other users' cursors
- **Props**:
  - `activeUsers` (object)
  - `currentSocketId` (string)

#### RoomPage Component

- **Purpose**: Room joining and management
- **Features**:
  - Room validation
  - Nickname input
  - Automatic room creation for invalid IDs
  - Loading states

### State Management

The application uses React hooks for state management:

- **Local State**: Component-specific state (drawing tools, user input)
- **Socket State**: Real-time data from WebSocket connections
- **URL State**: Room IDs and routing information
- **Local Storage**: User preferences (nickname)

### File Structure

```
src/
├── components/
│   ├── ui/                 # Radix UI components
│   ├── Whiteboard.jsx      # Main drawing canvas
│   ├── Toolbar.jsx         # Drawing tools
│   └── UserCursors.jsx     # Cursor tracking
├── pages/
│   ├── HomePage.jsx        # Landing page
│   └── RoomPage.jsx        # Room management
├── data/
│   └── api.js             # REST API functions
├── lib/
│   └── utils.js           # Utility functions
├── App.jsx                # Main app component
└── main.jsx               # Entry point
```

## 🚀 Deployment Guide

### Production Build

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Test the production build locally**
   ```bash
   npm run preview
   ```

### Environment Variables

**Production Environment Variables**

```env
VITE_BACKEND_URL=https://your-backend-domain.com
```

### Deployment Options

#### Vercel Deployment

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard**

#### Netlify Deployment

1. **Build the project**

   ```bash
   npm run build
   ```

2. **Upload `dist` folder to Netlify**

3. **Set environment variables in Netlify dashboard**

#### Docker Deployment

1. **Create Dockerfile**

   ```dockerfile
   FROM node:18-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Build and run**
   ```bash
   docker build -t collaborative-paint-frontend .
   docker run -p 80:80 collaborative-paint-frontend
   ```

### Performance Optimization

- **Code Splitting**: Implemented with React Router
- **Bundle Optimization**: Vite handles tree-shaking and minification

### Security Considerations

- **Environment Variables**: Never commit sensitive data
- **CORS**: Configure backend to allow frontend domain
- **HTTPS**: Always use HTTPS in production
- **Input Validation**: Validate room IDs and user input

## 🛠️ Development

### Code Style

- **ESLint**: Configured for React best practices
- **Prettier**: Code formatting (if configured)
- **Absolute Imports**: Use `@/` prefix for src directory imports

### Adding New Features

1. **Create component in appropriate directory**
2. **Add to routing if needed**
3. **Update API functions if required**
4. **Test with multiple users**
5. **Update documentation**

### Testing

```bash
# Run linting
npm run lint

# Build test
npm run build

# Preview build
npm run preview
```
