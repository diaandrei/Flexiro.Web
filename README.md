# Flexiro Front-End

A modern, responsive single-page application (SPA) built with React for small businesses seeking an affordable yet feature-rich e-commerce solution. This frontend client communicates with the ASP.NET backend to deliver a seamless shopping experience for both business owners and customers.

## Architecture Overview

The frontend follows a component-based architecture to ensure maintainability, reusability, and a consistent user experience:

### Structure
- **Component-Based Design**: Modular UI components for reusability and maintainability
- **State Management**: Redux for global state with Context API for component-specific state
- **Routing**: Client-side routing with React Router for a seamless SPA experience
- **Services Layer**: API integration services that handle backend communication

## Features

- **Responsive Design**: Works across desktop, tablet, and mobile devices
- **Product Browsing**: Advanced filtering, sorting, and search capabilities
- **Shopping Cart**: Dynamic cart management with real-time updates
- **User Authentication**: Secure login, registration, and profile management
- **Seller Dashboard**: Comprehensive tools for sellers to manage products and orders
- **Real-time Notifications**: Instant updates on order status and other events
- **Payment Integration**: Secure checkout process with Braintree payment gateway

## Technologies Used

- **Framework**: React with Hooks
- **State Management**: Redux + Context API
- **Routing**: React Router
- **Styling**: Tailwind CSS with responsive design principles
- **HTTP Client**: Axios for API communication
- **Real-time Updates**: SignalR client
- **Authentication**: JWT token management
- **Deployment**: Azure App Services
- **CI/CD**: Automated build and deployment pipeline

## Live Demo

### Deployed Application
- **Frontend Application**: [Live platform](https://flexiroweb-h3g0fvfkdbhcdvgk.uksouth-01.azurewebsites.net)
- **API Endpoints**: [API Endpoints](https://flexiroapi-d7akfuaug8d7esdg.uksouth-01.azurewebsites.net/swagger/index.html)

### Using the Platform
1. Visit the frontend application link
2. Browse products and navigate the platform without an account
3. To complete the checkout process, you'll need to register for an account
4. For seller registration, please note that admin approval is required before your shop will be displayed on the main screen

### Testing Payments
For testing payment functionality, you can use any of the following test cards:

- **Visa**: 4111 1111 1111 1111
- **Mastercard**: 5555 5555 5555 4444
- **Maestro**: 5018 0000 0009

Use any future expiration date for successful test payments.

For more test card options, please refer to the [Braintree Testing Documentation](https://developer.paypal.com/braintree/docs/guides/credit-cards/testing-go-live/php)

## Getting Started

### Prerequisites
- Node.js (v16.x or later)
- npm or yarn
- Access to the Flexiro backend API

### Installation

1. Clone the repository:
   ```bash
   git clone
   cd Flexiro.Web
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```
   The application will be available at `http://localhost:3000`

## Key Features

### User Experience
- **Intuitive Navigation**: Clear product categorization and search functionality
- **Fast Page Loading**: Optimized assets and code splitting for performance
- **Responsive Design**: Adapts to all device sizes

### Buyer Features
- **Product Discovery**: Browse, search, and filter products by category, price, etc.
- **Shopping Cart**: Add, remove, and manage items with quantity control
- **User Accounts**: Register, login, and manage personal information
- **Order History**: View and track past and current orders
- **Wishlists**: Save products for future purchase

### Seller Features
- **Product Management**: Add, edit, and remove products
- **Inventory Control**: Manage stock levels and product availability
- **Order Processing**: View and update order statuses
- **Shop Customization**: Personalize shop appearance and details

## Security

- **Secure Authentication**: JWT token management with secure storage
- **Protected Routes**: Role-based access control for pages and features
- **Form Validation**: Client-side validation
- **Secure Communication**: HTTPS for all API communication

## Deployment

### Building for Production

```bash
npm run build
# or
yarn build
```

This creates optimized production files in the `build` directory.

### Azure Deployment

1. Build the production bundle
2. Deploy to Azure App Service using GitHub Actions CI/CD pipeline
3. Configure environment variables in Azure App Service

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request
