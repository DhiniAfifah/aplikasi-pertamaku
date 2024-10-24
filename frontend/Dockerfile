# Gunakan Node.js sebagai base image
FROM node:20

# Set direktori kerja
WORKDIR /app

# Salin package.json dan package-lock.json ke dalam kontainer
COPY package*.json ./

# Instal dependensi
RUN npm install

# Salin semua file ke dalam kontainer
COPY . .

# Build aplikasi
RUN npm run build

# Expose port
EXPOSE 5173

# Jalankan aplikasi
CMD ["npm", "run", "preview"]
