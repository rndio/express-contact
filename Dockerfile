# Gunakan node image sebagai base image
FROM node:20-alpine

# Set working directory di dalam container
WORKDIR /usr/app

# Bundle app source
COPY . .

# Instal pnpm
RUN npm install -g pnpm

# Install dependencies
COPY package*.json ./

# Install dependencies menggunakan pnpm
RUN pnpm install

# Expose port yang digunakan oleh aplikasi
EXPOSE 5000

# Command untuk menjalankan aplikasi ketika container dijalankan
CMD ["npm", "start"]