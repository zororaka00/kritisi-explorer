# Kritisi Explorer

Kritisi Explorer is a web application that allows users to explore and analyze smart contracts across multiple blockchain networks. Currently supported networks include:
- Ethereum
- Arbitrum
- Base
- Optimism

It provides a user-friendly interface for viewing contract details, auditing results, and accessing security reports across these networks.

## Setup

Make sure to install the dependencies:

```bash
# bun
bun install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=your_database_url
CRON_SECRET_KEY=your_cron_secret

# Chain API Keys
ETHERSCAN_API_KEY=your_etherscan_key
ARBISCAN_API_KEY=your_arbiscan_key
BASESCAN_API_KEY=your_basescan_key
OPTIMISM_API_KEY=your_optimism_key

# AI Integration
GEMINI_API_KEY=your_gemini_key
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# bun
bun run dev
```

## Production

Build the application for production:

```bash
# bun
bun run build
```

Locally preview production build:

```bash
# bun
bun run preview
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please contact me at [rakawidhiantoro@gmail.com](mailto:rakawidhiantoro@gmail.com).