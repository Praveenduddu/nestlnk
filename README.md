# NestLnk (Interior Colab)

NestLnk is a comprehensive platform designed to bridge the gap between property owners (Customers) and interior design firms. It allows customers to post their interior design requirements ("Property Briefs"), receive quotations from verified firms, and use advanced AI to compare these quotes for better decision-making.

The project consists of a robust Spring Boot backend, a modern React web frontend, and a feature-rich Flutter mobile application.

## 🚀 Key Features

- **Multi-Role Authentication**: Secure login and registration for Customers, Firms, and Admins using JWT.
- **Property Brief Management**: Customers can create detailed briefs for their properties, including image uploads and specific requirements.
- **Quotation System**: Verified firms can browse open briefs and submit detailed quotations.
- **AI-Powered Quote Comparison**: Uses Google Gemini AI to analyze and compare multiple quotations, providing insights via Server-Sent Events (SSE).
- **Admin Dashboard**: Tools for user management, firm verification, and property moderation.
- **Interactive Dashboards**: Real-time analytics and data visualization using Recharts.
- **Responsive Web & Mobile**: Seamless experience across desktop and mobile devices.

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.3
- **Language**: Java 17
- **Database**: PostgreSQL
- **Security**: Spring Security with JWT (JSON Web Tokens)
- **AI Integration**: Google GenAI SDK (Gemini)
- **Documentation**: OpenAPI / Swagger (SpringDoc)
- **Build Tool**: Maven

### Frontend (Web)
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Mobile App
- **Framework**: Flutter
- **Language**: Dart
- **State Management**: Provider
- **Navigation**: Go Router
- **Networking**: Dio
- **Theming**: Google Fonts

## 📁 Project Structure

```text
.
├── backend/            # Spring Boot Application
│   ├── src/            # Java Source Code
│   ├── uploads/        # Local storage for images and PDFs
│   └── pom.xml         # Maven dependencies
├── frontend/           # React Web Application
│   ├── src/            # React Source Code
│   └── package.json    # Node.js dependencies and scripts
└── mobile_app/         # Flutter Mobile Application
    ├── lib/            # Dart Source Code
    └── pubspec.yaml    # Flutter dependencies
```

## 🏁 Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Flutter SDK
- PostgreSQL
- Google Gemini API Key

### Backend Setup
1. Navigate to `backend/`.
2. Configure `src/main/resources/application.yml` with your database and AI settings.
3. Run `./mvnw spring-boot:run`.

### Frontend Setup
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`.
3. Start development server: `npm run dev`.

### Mobile App Setup
1. Navigate to `mobile_app/`.
2. Install dependencies: `flutter pub get`.
3. Run on device/emulator: `flutter run`.

## 📄 License
This project is private and intended for the NestLnk development team.
