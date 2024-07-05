const express = require('express')
const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
// const helmet = require('helmet')
// const { getImage } = require('./images');


const prisma = new PrismaClient()
const app = express()

app.use(express.json())
// app.use(helmet())

// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       defaultSrc: ["'self'"],
//       scriptSrc: ["'self'"],
//       imgSrc: ["'self'", "../images"],
//     },
//   })
// );

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

// app.get('/produtos', async (req, res) => {
//   const products = await prisma.product.findMany()
//   for (const product of products) {
//     const { id, image } = product;
//     // console.log(`Product ${id} image: ${image}`);
//     // console.log(`Product ${id} image: ${getImage(image)}`);
//     product.image = getImage(image);
//   }
//   res.json(products)
// });
// app.post(`/signup`, async (req, res) => {
//   const { name, email, posts } = req.body

//   const postData = posts
//     ? posts.map((post) => {
//         return { title: post.title, content: post.content || undefined }
//       })
//     : []

//   const result = await prisma.user.create({
//     data: {
//       name,
//       email,
//       posts: {
//         create: postData,
//       },
//     },
//   })
//   res.json(result)
// })

// app.post(`/post`, async (req, res) => {
//   const { title, content, authorEmail } = req.body
//   const result = await prisma.post.create({
//     data: {
//       title,
//       content,
//       author: { connect: { email: authorEmail } },
//     },
//   })
//   res.json(result)
// })

// app.put('/post/:id/views', async (req, res) => {
//   const { id } = req.params

//   try {
//     const post = await prisma.post.update({
//       where: { id: Number(id) },
//       data: {
//         viewCount: {
//           increment: 1,
//         },
//       },
//     })

//     res.json(post)
//   } catch (error) {
//     res.json({ error: `Post with ID ${id} does not exist in the database` })
//   }
// })

// app.put('/publish/:id', async (req, res) => {
//   const { id } = req.params

//   try {
//     const postData = await prisma.post.findUnique({
//       where: { id: Number(id) },
//       select: {
//         published: true,
//       },
//     })

//     const updatedPost = await prisma.post.update({
//       where: { id: Number(id) || undefined },
//       data: { published: !postData.published || undefined },
//     })
//     res.json(updatedPost)
//   } catch (error) {
//     res.json({ error: `Post with ID ${id} does not exist in the database` })
//   }
// })

// app.delete(`/post/:id`, async (req, res) => {
//   const { id } = req.params
//   const post = await prisma.post.delete({
//     where: {
//       id: Number(id),
//     },
//   })
//   res.json(post)
// })

// app.get('/users', async (req, res) => {
//   const users = await prisma.user.findMany()
//   res.json(users)
// })

// app.get('/user/:id/drafts', async (req, res) => {
//   const { id } = req.params

//   const drafts = await prisma.user
//     .findUnique({
//       where: {
//         id: Number(id),
//       },
//     })
//     .posts({
//       where: { published: false },
//     })

//   res.json(drafts)
// })

// app.get(`/post/:id`, async (req, res) => {
//   const { id } = req.params

//   const post = await prisma.post.findUnique({
//     where: { id: Number(id) },
//   })
//   res.json(post)
// })

// app.get('/feed', async (req, res) => {
//   const { searchString, skip, take, orderBy } = req.query

//   const or = searchString
//     ? {
//         OR: [
//           { title: { contains: searchString } },
//           { content: { contains: searchString } },
//         ],
//       }
//     : {}

//   const posts = await prisma.post.findMany({
//     where: {
//       published: true,
//       ...or,
//     },
//     include: { author: true },
//     take: Number(take) || undefined,
//     skip: Number(skip) || undefined,
//     orderBy: {
//       updatedAt: orderBy || undefined,
//     },
//   })

//   res.json(posts)
// })

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/js/rest-express#3-using-the-rest-api`),
)
