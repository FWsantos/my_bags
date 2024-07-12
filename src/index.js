const express = require('express')
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Bem-vindo à API!');
});

app.get('/produtos', async (req, res) => {
    try {
        const produtos = await prisma.product.findMany();

        // Ler as imagens do disco
        const produtosComImagens = await Promise.all(produtos.map(async produto => {
            console.log(produto);
            const imagePath = path.resolve(__dirname, produto.image);
            const imageData = await fs.promises.readFile(imagePath);
            return { ...produto, image: imageData.toString('base64') };
        }));

        res.json(produtosComImagens);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao obter produtos e imagens.');
    }
});

const server = app.listen(3000, () =>
  console.log(`
🚀 Servidor online em: http://localhost:3000`),
)
