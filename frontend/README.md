# EventHub Frontend
This project is created with the react router template.

## About React Router!

A modern, production-ready template for building full-stack React applications using React Router.

## Deployment (Quickest way to run the project)

### Docker Deployment

This template includes three Dockerfiles optimized for different package managers:

- `Dockerfile` - for npm
- `Dockerfile.pnpm` - for pnpm
- `Dockerfile.bun` - for bun

To build and run using Docker:

```bash
# For npm
docker build -t eventhub_frontend .

# For pnpm
docker build -f Dockerfile.pnpm -t eventhub_frontend .

# For bun
docker build -f Dockerfile.bun -t eventhub_frontend .

# Run the container
docker run -p 3000:3000 eventhub_frontend
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway
---


## Local Development

### Installation

Environment:


NodeJS: `v20.18.1`
Pnpm: `v9.14.4`

Install the dependencies:

```bash
pnpm install
```

### Development

Start the development server with HMR:

```bash
pnpm run dev
```

Your application will be available at `http://localhost:3000`.

## Building for Production

Create a production build:

```bash
pnpm run build
```

Built with ❤️ using React Router.

## References
Solidity icon: <a target="_blank" href="https://icons8.com/icon/at2DODSyQznb/solidity">Solidity</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>