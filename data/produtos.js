// Dados mockados (depois vamos puxar da API Flask)

export const processadores = [
  {
    id: 1,
    categoria: "Processador",
    nome: "Intel Core i5-12400F",
    socket: "LGA1700",
    tdp: 117,
    preco: 899.90,
  },
  {
    id: 2,
    categoria: "Processador",
    nome: "AMD Ryzen 5 5600",
    socket: "AM4",
    tdp: 65,
    preco: 749.90,
  },
  {
    id: 3,
    categoria: "Processador",
    nome: "AMD Ryzen 7 7700X",
    socket: "AM5",
    tdp: 105,
    preco: 1899.00,
  },
];

export const placasMae = [
  {
    id: 10,
    categoria: "Placa Mãe",
    nome: "Gigabyte B660M DS3H",
    socket: "LGA1700",
    tipoRam: "DDR4",
    preco: 799.00,
  },
  {
    id: 11,
    categoria: "Placa Mãe",
    nome: "ASUS Prime B550M-A",
    socket: "AM4",
    tipoRam: "DDR4",
    preco: 699.00,
  },
  {
    id: 12,
    categoria: "Placa Mãe",
    nome: "MSI PRO B650M-A",
    socket: "AM5",
    tipoRam: "DDR5",
    preco: 1299.00,
  },
];

export const memorias = [
  {
    id: 20,
    categoria: "Memória RAM",
    nome: "Kingston Fury 16GB 3200MHz",
    tipo: "DDR4",
    watts: 6,
    preco: 259.00,
  },
  {
    id: 21,
    categoria: "Memória RAM",
    nome: "Corsair Vengeance 32GB 3600MHz",
    tipo: "DDR4",
    watts: 10,
    preco: 499.00,
  },
  {
    id: 22,
    categoria: "Memória RAM",
    nome: "Kingston Fury 16GB 5200MHz",
    tipo: "DDR5",
    watts: 8,
    preco: 389.00,
  },
];

export const placasVideo = [
  {
    id: 30,
    categoria: "Placa de Vídeo",
    nome: "NVIDIA RTX 3060 12GB",
    tdp: 170,
    preco: 1899.00,
  },
  {
    id: 31,
    categoria: "Placa de Vídeo",
    nome: "NVIDIA RTX 4070",
    tdp: 200,
    preco: 3799.00,
  },
  {
    id: 32,
    categoria: "Placa de Vídeo",
    nome: "AMD Radeon RX 6700 XT",
    tdp: 230,
    preco: 2199.00,
  },
];

export const fontes = [
  {
    id: 40,
    categoria: "Fonte",
    nome: "Corsair CV500 500W",
    watts: 500,
    preco: 299.00,
  },
  {
    id: 41,
    categoria: "Fonte",
    nome: "XPG Pylon 650W 80+ Bronze",
    watts: 650,
    preco: 449.00,
  },
  {
    id: 42,
    categoria: "Fonte",
    nome: "Corsair RM850x 850W 80+ Gold",
    watts: 850,
    preco: 899.00,
  },
];

export const armazenamentos = [
  {
    id: 50,
    categoria: "Armazenamento",
    nome: "SSD Kingston NV2 500GB NVMe",
    watts: 5,
    preco: 249.00,
  },
  {
    id: 51,
    categoria: "Armazenamento",
    nome: "SSD WD Blue 1TB NVMe",
    watts: 7,
    preco: 449.00,
  },
];

// Lista completa pra pagina "Ver todos os Hardwares"
export const todosProdutos = [
  ...processadores,
  ...placasMae,
  ...memorias,
  ...placasVideo,
  ...fontes,
  ...armazenamentos,
];
