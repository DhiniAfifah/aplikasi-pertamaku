# Gunakan image Node.js sebagai base image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file ke dalam container, kecuali yang diabaikan oleh .dockerignore
COPY . .

# Ekspose port yang digunakan
EXPOSE 3000

# Jalankan aplikasi backend
CMD ["node", "server.js"]
