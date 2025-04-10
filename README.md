# Verifiable Credentials System

A TypeScript-based system for issuing and verifying verifiable credentials.

## Features

- Issue verifiable credentials
- Verify credentials
- Modern web interface
- TypeScript support

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/verifiable-credentials.git
   cd verifiable-credentials
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To run the development server:

```bash
npm run dev
```

The server will start on http://localhost:3000

## Building

To build the project:

```bash
npm run build
```

## Production

To run in production mode:

```bash
npm start
```

## API Endpoints

- `POST /api/credentials/issue` - Issue a new credential
- `POST /api/credentials/verify` - Verify a credential
- `POST /api/credentials/present` - Present a credential

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests! 
