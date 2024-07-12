const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const productData = [
  {
      name: 'Estojo',
      description: 'Estojo escolar',
      price: 6.00,
      image: '../images/estojo.jpg',
    },
    {
      name: 'Mochila',
      description: 'Mochila escolar',
      price: 50.00,
      image: '../images/mochila.jpg',
  },
]

async function main() {
  console.log(`Start seeding ...`)
  for (const p of productData) {
    const product = await prisma.product.create({
      data: p,
    })
    console.log(`Created product with id: ${product.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
