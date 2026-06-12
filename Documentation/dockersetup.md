# Step-by-Step Docker Setup Guide for Synibe

This document outlines the step-by-step process to set up, build, run, and troubleshoot the Docker deployment for the Synibe application.

---

## 📋 Prerequisites

Before running the application, make sure you have the following installed on your system:
- **Docker Desktop** (version 20.10+ recommended)
- **Docker Compose** (comes pre-bundled with Docker Desktop)
- A configured `.env` file in the root directory of the project.

---

## 🚀 Step-by-Step Setup Process

Follow these steps to run the application using Docker:

### Step 1: Configure Environment Variables
Verify that you have a `.env` file in the project root containing your secrets, database connection URLs, and client-side URLs. Note that the database connection string (`DATABASE_URL`) should not include TCP-only parameters like `&channel_binding=require`.

### Step 2: Build the Container Images
Run the following command in the project root to build the images for both the `web` (Next.js) and `socket` (Socket.io) services:
```bash
docker compose build
```
This command triggers the Docker daemon to build the images defined in `docker-compose.yml`, resolving all necessary build-time arguments (`ARG`) from your local `.env`.

### Step 3: Run the Services
Spin up both containers in detached mode (running in the background):
```bash
docker compose up -d
```
This will start:
- The **web app** on [http://localhost:3000](http://localhost:3000)
- The **socket server** on [http://localhost:3001](http://localhost:3001)

### Step 4: Verify the Containers are Running
To verify that both containers are active and check their status, run:
```bash
docker compose ps
```

### Step 5: Check Application Logs
If you want to view real-time log outputs to check connection statuses or debug issues, use:
```bash
docker compose logs -f
```

### Step 6: Stop the Application
When you want to stop the containers without deleting built images or networks:
```bash
docker compose stop
```

To stop and completely remove the containers, networks, and volumes:
```bash
docker compose down
```

---

## 🐳 Dockerfile Instructions Explained in Detail

Our `Dockerfile` is built using a **multi-stage build** workflow. Multi-stage builds compile code in temporary builder stages and copy only the final assets into a minimal production runner image. This reduces image size from ~1GB down to ~150MB.

Here is what each instruction does:

| Command | Stage | Explanation |
| :--- | :--- | :--- |
| `FROM node:20-alpine AS deps` | **Stage 1 (deps)** | Starts the dependency-installation stage using the official, minimal Alpine Linux-based image containing Node.js v20. |
| `WORKDIR /app` | **Stage 1 (deps)** | Sets the working directory inside the container to `/app`. All subsequent commands run here. |
| `COPY package.json package-lock.json* ./` | **Stage 1 (deps)** | Copies the package manifest files to the working directory. |
| `RUN npm ci` | **Stage 1 (deps)** | Installs the exact dependencies locked in `package-lock.json` cleanly, optimized for CI/CD and production environments. |
| `FROM node:20-alpine AS builder` | **Stage 2 (builder)** | Starts the compilation stage. |
| `WORKDIR /app` | **Stage 2 (builder)** | Sets `/app` as the working directory. |
| `COPY --from=deps /app/node_modules ./node_modules` | **Stage 2 (builder)** | Copies the pre-installed `node_modules` from Stage 1 (`deps`), saving build time. |
| `COPY . .` | **Stage 2 (builder)** | Copies the rest of the application source code into the builder stage. |
| `ARG <VARIABLE_NAME>` | **Stage 2 (builder)** | Defines a build-time variable that can be passed to Docker during the build process (e.g., `ARG DATABASE_URL`). |
| `ENV <VARIABLE_NAME>=$<VARIABLE_NAME>` | **Stage 2 (builder)** | Maps the build-time argument to a shell environment variable so the bundler can access it during the compile step. |
| `RUN npm run build` | **Stage 2 (builder)** | Compiles the Next.js application into static html/css and server bundles inside the `.next` folder. |
| `FROM node:20-alpine AS runner` | **Stage 3 (runner)** | Starts the lightweight final production image. |
| `WORKDIR /app` | **Stage 3 (runner)** | Sets the active directory to `/app`. |
| `ENV NODE_ENV=production` | **Stage 3 (runner)** | Informs dependencies and Next.js to optimize execution for production mode. |
| `COPY --from=builder /app/public ./public` | **Stage 3 (runner)** | Copies static assets (images, fonts, etc.) to the final image. |
| `COPY --from=builder /app/.next ./.next` | **Stage 3 (runner)** | Copies the compiled Next.js production builds. |
| `COPY --from=builder /app/node_modules ./node_modules` | **Stage 3 (runner)** | Copies the node dependencies. |
| `COPY --from=builder /app/package.json ./package.json` | **Stage 3 (runner)** | Copies the package configuration containing startup scripts. |
| `COPY --from=builder /app/server.js ./server.js` | **Stage 3 (runner)** | Copies the standalone Socket.io server script. |
| `EXPOSE 3000` | **Stage 3 (runner)** | Informs Docker that the container listens on port 3000 at runtime (informational only). |
| `CMD ["npm", "start"]` | **Stage 3 (runner)** | Specifies the default command to execute when the container launches (`next start`). |

---

## 🐙 Docker Compose Configurations Explained

The `docker-compose.yml` file organizes how the `web` and `socket` services interact:

1. **`build` block**:
   - `context: .`: Build context is the current directory.
   - `args`: Resolves the environment variables from `.env` and passes them to the `builder` stage in the `Dockerfile`. Without this, `NEXT_PUBLIC_` variables compile as `undefined` in client bundles.
2. **`ports`**:
   - `"3000:3000"` (for web) and `"3001:3001"` (for socket) map the container ports to your local host machine.
3. **`env_file: - .env`**:
   - Automatically injects variables from `.env` as container environment variables at runtime.
4. **`command: ["node", "server.js"]`**:
   - Overrides the default `CMD ["npm", "start"]` inside the `socket` container to start the custom Socket.io server instead of Next.js.
5. **`restart: always`**:
   - Tells Docker to automatically restart the container if it exits abnormally or when the daemon restarts.

---

## 🔧 Common Troubleshooting Steps

### 1. Host Port is Already Occupied
If you see `bind: address already in use` or `ports are not available` when running `docker compose up`:
- Find and stop any other local processes running on port `3000` or `3001`.
- To clean up orphaned Docker containers, run:
  ```bash
  docker compose down
  ```

### 2. NextAuth `UntrustedHost` Error
If NextAuth throws an error saying the host is untrusted:
- Ensure `AUTH_TRUST_HOST=true` is set under the environment section in `docker-compose.yml`.
- Ensure `AUTH_URL` points to your active URL (e.g. `http://localhost:3000`).
