# Transaction Reconciler Frontend

A modern React application for automated bank transaction reconciliation.

## 🚀 Features

- **Modern UI**: Clean, responsive design with gradient backgrounds and professional styling
- **File Upload**: Drag-and-drop CSV file upload with validation
- **Real-time Validation**: File type and size validation before upload
- **Loading States**: Animated loading indicators during processing
- **Error Handling**: Comprehensive error messages with toast notifications
- **Results Display**: Beautiful summary cards and detailed results table
- **Pagination**: Smart pagination for large result sets
- **Responsive Design**: Mobile-friendly interface that works on all devices

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **Styled Components** - CSS-in-JS styling
- **Axios** - HTTP client for API calls
- **React Toastify** - Toast notifications
- **Create React App** - Build tooling

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

## 🏗️ Build

```bash
npm run build
```

Builds the app for production to the `build` folder.

## 🔧 Configuration

The API base URL is configured in `.env`:

```
REACT_APP_API_BASE_URL=http://localhost:8080
```

## 📱 Components

- **Header**: Application header with logo and status
- **FileUpload**: Drag-and-drop file upload component
- **ReconciliationResults**: Results display with summary and table
- **Pagination**: Smart pagination component
- **LoadingSpinner**: Animated loading indicator

## 🎨 Styling

The application uses styled-components for styling with:
- Modern gradient backgrounds
- Responsive grid layouts
- Professional typography (Inter font)
- Smooth animations and transitions
- Mobile-first responsive design

## 🔍 Features in Detail

### File Upload
- Drag-and-drop interface
- File type validation (CSV only)
- File size validation (10MB limit)
- File preview with name and size
- Remove file functionality

### Results Display
- Summary cards with key metrics
- Color-coded match types
- Formatted currency and dates
- Responsive table with horizontal scroll
- Pagination for large datasets

### Error Handling
- Toast notifications for user feedback
- Comprehensive error messages
- Form validation
- Network error handling

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## ♿ Accessibility

- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- High contrast colors
- Touch-friendly interface
