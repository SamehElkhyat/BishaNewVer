# Bisha Chamber of Commerce Website

This is the official website for the Bisha Chamber of Commerce, built with Next.js.

## API Integration

The website is integrated with the Bisha Chamber API at https://backend.bishahcc.org/swagger/index.html.

### API Services

The API integration is structured in the following way:

- `src/services/api.js` - Main API service that handles all API requests
- `src/services/fileService.js` - Service for handling file uploads

### Authentication

Authentication is handled through the AuthContext:

- `src/contexts/AuthContext.js` - Manages user authentication state and API calls

### Admin Features

The admin section includes:

- News management
- Client management
- Authentication

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_API_URL=https://backend.bishahcc.org/api
```

## Features

- Arabic language support
- Responsive design
- Admin dashboard
- News management
- Client management
- Interactive map
- Media center
