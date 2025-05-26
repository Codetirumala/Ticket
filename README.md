# Service Desk Application

A modern service desk application built with React and Firebase, allowing users to create and manage support tickets.

## Features

- Google Authentication using Firebase
- Create and manage support tickets
- Track ticket status and updates
- Add comments to tickets
- Responsive design for all devices
- Real-time updates

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>

```

2. Install dependencies:
```bash
cd client
npm install
```

3. Configure Firebase:
   - Create a new Firebase project at https://console.firebase.google.com/
   - Enable Google Authentication in the Firebase Console
   - Copy your Firebase configuration from Project Settings
   - Replace the Firebase config in `client/src/firebase.js` with your configuration

4. Start the development server:
```bash
npm start
```

The application will be available at http://localhost:3000

## Project Structure

```
client/
  ├── src/
  │   ├── components/
  │   │   ├── Dashboard.js
  │   │   ├── Login.js
  │   │   ├── Navbar.js
  │   │   ├── CreateTicket.js
  │   │   ├── TicketList.js
  │   │   └── TicketDetails.js
  │   ├── App.js
  │   ├── firebase.js
  │   └── index.js
  └── package.json
```

## Technologies Used

- React
- Material-UI
- Firebase Authentication
- React Router
- React Firebase Hooks

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.




   Step 1: Admin Setup
   - Create admin collection in Firestore
   - Add admin role to user profiles
   - Create admin authentication check

   Step 2: Admin Routes & Navigation
   - Create AdminDashboard component
   - Add admin routes in App.js
   - Add admin navigation items

   Step 3: Admin Features
   - User Management
     * View all users
     * Edit user roles
     * Disable/enable users
   
   - Ticket Management
     * View all tickets
     * Assign tickets
     * Update ticket status
     * Add comments/responses
   
   - Analytics
     * Ticket statistics
     * User statistics
     * Response time metrics