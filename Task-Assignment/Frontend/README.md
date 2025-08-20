# Space Mission Control Dashboard

A modern, space-themed task and submission management system built with React, Tailwind CSS, and a microservices backend.

## 🚀 Features

- **Role-based Authentication**: Admin and User roles with JWT-based security
- **Task Management**: Create, assign, and track tasks with deadlines and tags
- **Submission System**: GitHub link submissions with approval workflow
- **Real-time Dashboard**: Statistics and quick actions based on user role
- **Space Theme**: Dark gradient backgrounds with neon accents and animations
- **Responsive Design**: Mobile-first approach with glassmorphism UI components
- **Accessibility**: Semantic HTML, ARIA labels, and keyboard navigation

## 🛠 Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **Tailwind CSS 3** for styling with custom space theme
- **Framer Motion** for smooth animations and transitions
- **React Router v6** for navigation with protected routes
- **React Query** for data fetching and caching
- **Headless UI** for accessible components
- **Lucide React** for icons

### Backend (Microservices)
- **Spring Boot** with Spring Cloud Gateway
- **MongoDB** for data persistence
- **JWT Authentication** with role-based access control
- **Eureka Service Registry** for service discovery

## 📁 Project Structure

```
src/
├── api/           # API wrapper with axios
├── components/    # Reusable UI components
├── context/       # React context providers
├── pages/         # Route components
├── routes.jsx     # Route configuration
└── main.jsx       # App entry point
```

## 🔧 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd space-mission-control
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8085
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🌐 Backend Services

The application connects to several microservices:

- **API Gateway**: `http://localhost:8085` (Entry point)
- **User Service**: `http://localhost:8080` (Authentication & profiles)
- **Task Service**: `http://localhost:8081` (Task management)
- **Submission Service**: `http://localhost:8082` (Submission handling)
- **Service Registry**: `http://localhost:8761` (Eureka server)

## 🎭 User Roles

### Administrator
- Create, edit, and delete tasks
- Assign tasks to users
- Review and approve/decline submissions
- View all system statistics
- Manage user accounts

### User
- View assigned tasks
- Submit GitHub links for completed tasks
- Track submission status
- View personal dashboard

## 🎨 Design System

### Colors
- **Primary**: Neon Cyan (`#7dd3fc`)
- **Secondary**: Neon Purple (`#a78bfa`)
- **Background**: Dark gradient from slate to indigo
- **Glass Cards**: Semi-transparent with backdrop blur

### Typography
- **Headings**: 120% line height, gradient text effects
- **Body**: 150% line height for readability
- **Max 3 font weights** for consistency

### Spacing
- **8px base unit** for consistent spacing
- **Responsive breakpoints**: 320px (mobile), 768px (tablet), 1024px (desktop)

## 🔐 Authentication Flow

1. User signs up with email, password, full name, mobile, and role
2. JWT token issued on successful authentication
3. Token stored securely and included in API requests
4. Protected routes redirect to sign-in if not authenticated
5. Role-based access control for admin features

## 📱 Responsive Design

- **Mobile First**: Base styles for 320px+ screens
- **Tablet**: Enhanced layouts for 768px+ screens  
- **Desktop**: Full feature layouts for 1024px+ screens
- **Flexbox/Grid**: Modern CSS layout techniques
- **Touch Friendly**: 44px minimum touch targets

## 🎯 Performance

- **Code Splitting**: React.lazy for route-based splitting
- **Tree Shaking**: Optimized icon imports
- **Image Optimization**: Lazy loading with loading="lazy"
- **Bundle Size**: Target <200kB for optimal performance

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality
- **ESLint**: Airbnb configuration
- **File Organization**: <300 lines per file
- **Component Structure**: Single responsibility principle
- **Accessibility**: ARIA labels and semantic HTML

## 📄 License

This project is for educational purposes as part of a microservices architecture demonstration.