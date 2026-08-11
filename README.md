# UzhavarSetu 🌾

> **From Farm to Fair Market** — An Indian AgriTech platform connecting farmers with buyers transparently.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 5 |
| 3D | Three.js + React Three Fiber + @react-three/drei |
| Animation | Framer Motion |
| Icons | Lucide React |
| Styling | CSS Modules + CSS Variables |

## Project Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── RoleSelector.jsx      # Farmer / Buyer tab switcher
│   │   ├── LoginForm.jsx         # Shared form primitives
│   │   ├── FarmerLogin.jsx       # Farmer-specific form
│   │   └── BuyerLogin.jsx        # Buyer-specific form
│   ├── branding/
│   │   └── Logo.jsx              # Logo with SVG wheat icon
│   └── three/
│       └── FarmScene.jsx         # R3F canvas (placeholder → detailed in Task 2)
├── pages/
│   └── Login.jsx                 # Split-screen login page
├── styles/
│   ├── tokens.css                # CSS custom property design tokens
│   └── global.css                # Global resets & base styles
├── App.jsx
└── main.jsx
```

## Getting Started

```bash
npm install
npm run dev
```

Visit: http://localhost:5173

## Roadmap

- [x] **Task 1**: Frontend foundation + Login page
- [ ] **Task 2**: Detailed Three.js farm-to-market scene
- [ ] **Task 3**: Farmer & Buyer dashboards
- [ ] **Task 4**: Backend + real auth + Kafka
