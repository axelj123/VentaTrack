# VentaTrack

VentaTrack is a mobile application for managing and tracking sales, allowing users to register transactions, analyze sales data, and interact with an inventory system in real time.


https://github.com/user-attachments/assets/c82e2270-5a6b-4483-97ab-9175879594ba

## Features

### Sales Management
- **Transaction Recording**: Easily register sales with detailed information
  - Product details and pricing
  - Customer information
  - Transaction date and time
  - Payment methods
  - Sales representative details

### Analytics Dashboard
- **Real-time Statistics**: Monitor your business performance
  - Daily, weekly, and monthly sales reports
  - Revenue trends and projections
  - Top-selling products
  - Customer purchase patterns
- **Interactive Visualizations**: Understand your data better
  - Sales performance graphs
  - Inventory level charts
  - Revenue distribution diagrams

### Inventory Control
- **Stock Management**
  - Real-time inventory tracking
  - Automatic stock updates with each sale
  - Low stock alerts
  - Product categorization
- **Product Management**
  - Add, edit, and remove products
  - Set minimum stock levels
  - Track product performance

### Reporting System
- **Export Capabilities**
  - Generate detailed PDF reports
  - Custom date range selection
  - Multiple report templates
  - Data filtering options

## Technical Stack

### Frontend
- **React Native**: Cross-platform mobile development
  - Custom UI components
  - Responsive design
  - Native performance

### Backend
- **SQLite Database**
  - Local data storage
  - Efficient querying
  - Data persistence
  - Offline functionality

## Prerequisites

Before installing VentaTrack, ensure you have the following:

### Required Software
1. **Node.js** (v14.0.0 or higher)
   - Download from [Node.js official website](https://nodejs.org/)
   - Verify installation: `node --version`

2. **Android Studio**
   - Download from [Android Studio official website](https://developer.android.com/studio)
   - Required for Android development
   - Install Android SDK during setup

### Development Environment
- **Windows/macOS/Linux** operating system
- Minimum 8GB RAM recommended
- At least 10GB free disk space

## Installation

Follow these steps to set up VentaTrack locally:

1. **Clone the Repository**
```bash
git clone https://github.com/axelj123/VentaTrack.git
cd VentaTrack
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment**
- Copy `.env.example` to `.env`
- Update configuration values as needed

4. **Start the Development Server**
```bash
npm start
```

5. **Run on Android**
```bash
npm run android
```

## Project Structure

```
VentaTrack/
├── android/         # Android native files
├── assets/         # Images, fonts, and other static files
├── components/     # Reusable React Native components
├── screens/        # Application screens
├── database.js     # Database configuration
├── Navigation.js   # Navigation setup
└── App.js         # Application entry point
```

## Contributing

We welcome contributions to VentaTrack! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support and Contact

If you encounter any issues or have questions, please reach out:

- **Email**: axeljhosmell13@gmail.com
- **LinkedIn**: [@Axel Muñoz Silva](https://www.linkedin.com/in/axel-muñoz-silva/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
