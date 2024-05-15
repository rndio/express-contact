# Gunakan node image sebagai base image
FROM node:14

# Set working directory di dalam container
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port yang digunakan oleh aplikasi
EXPOSE 3000

# Command untuk menjalankan aplikasi ketika container dijalankan
CMD ["npm", "start"]
