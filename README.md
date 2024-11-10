# HereNow Portal

A modern web platform for tracking and managing community service activities, built with the [T3 Stack](https://create.t3.gg/).

## 🌟 Overview

HereNow Portal is a comprehensive platform designed to streamline the management and tracking of community service activities. Whether you're a student logging hours, a lecturer overseeing service projects, or an organization managing volunteers, HereNow Portal provides the tools you need.

## 🚀 Features

- **Lecturer Portal**
  - Track community service hours
  - View service history and progress
  - Generate detailed activity reports
  - Submit new organisation requests
  - Manage student registrations
  - Approve service hours
  - Review organisation requests

- **Advanced Features**
  - Real-time tracking and updates
  - PDF report generation
  - CSV bulk imports
  - Email notifications
  - Mobile-responsive design

## 🛠 Tech Stack

- **Frontend**
  - [Next.js 14](https://nextjs.org) - React framework
  - [Tailwind CSS](https://tailwindcss.com) - Styling
  - [Framer Motion](https://www.framer.com/motion/) - Animations
  - [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - 3D graphics

- **Backend & Services**
  - [tRPC](https://trpc.io) - End-to-end typesafe APIs
  - [Firebase](https://firebase.google.com) - Database & Authentication
  - [Clerk](https://clerk.com) - User management
  - [SendGrid](https://sendgrid.com) - Email services

- **Development Tools**
  - [TypeScript](https://www.typescriptlang.org/)
  - [ESLint](https://eslint.org/)
  - [Prettier](https://prettier.io/)

## 🏗 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/herenow-portal.git
   cd herenow-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in the environment variables:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
   CLERK_SECRET_KEY=
   FIREBASE_API_KEY=
   FIREBASE_AUTH_DOMAIN=
   FIREBASE_DATABASE_URL=
   FIREBASE_PROJECT_ID=
   FIREBASE_STORAGE_BUCKET=
   FIREBASE_MESSAGING_SENDER_ID=
   FIREBASE_APP_ID=
   SENDGRID_API_KEY=
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

Need help? We're here for you!

- 📚 [Documentation](https://docs.herenow.com)
- 💬 [Discord Community](https://discord.gg/herenow)
- 📧 Email: support@herenow.com
- 🐛 [Issue Tracker](https://github.com/your-username/herenow-portal/issues)

## 🙏 Acknowledgments

- Built with [create-t3-app](https://create.t3.gg/)
- Special thanks to all our contributors and community members
- Inspired by the need for better community service management tools in education

## 🔄 Updates

Stay up to date with the latest features and improvements:

- Follow us on [Twitter](https://twitter.com/herenowportal)
- Star this repository
- Subscribe to our newsletter at [herenow.com/newsletter](https://herenow.com/newsletter)