import express, { request, response } from "express"
import prisma from "./PrismaClient.js";

const app = express();
app.use(express.json());

app.get("/users", async (request, response) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                name: "asc"
            }
        });
        return response.status(200).json(users);
    } catch(error) {
        return response.status(500).send();
    }
})

// pagination
app.get("/users-posts", async (request, response) => {
  const { page = 1, limit = 5 } = request.query

  const take = Number(limit)
  const skip = (Number(page) - 1) * take

  try {
    const users = await prisma.user.findMany({ skip, take });

    const total = await prisma.user.count();

    return response.json({
      total,
      page: Number(page),
      totalPages: Math.ceil(total / take),
      data: users
    })

  } catch (error) {
    return response.status(500).send()
  }
})


app.post("/users", async (request, response) => {
    const { name, email, phone } = request.body;
    try {
            const user = await prisma.user.create({
            data: {  name,  email, phone }
        })
        return response.status(201).json(user);
    } catch(error) {
        return response.status(500).send();
    }
})

app.put("/users/:id", async (request, response) => {
    const { name, email, phone } = request.body;
    const { id } = request.params;
    try {
        const user = await prisma.user.findUnique({ where: { id } });

        if(!user) {
            return response.status(404).json("User not found");
        }

        const userUpdated = await prisma.user.update({
            data: { name, email, phone },
            where: { id }
        })

        return response.status(200).json(userUpdated);
    } catch(error) {
        return response.status(500).send();
    }
})

app.delete("/users/:id", async (request, response) => {
    const { id } = request.params;
    try {
        const user = await prisma.user.findUnique({ where: { id } });

        if(!user) {
            return response.status(404).json("User not found");
        }

        await prisma.user.delete({ 
            where: { id }
        })

        return response.status(204).send();
    } catch(error) {
        return response.status(500).send();
    }
})

app.post("/conhecimentos", async (request, response) => {
    const { title, description, category, level, userId } = request.body;

    try{

        const ofertas = await prisma.offer.create({
            data: { title, description, category, level, userId }
        })
        return response.status(201).json("Oferta cadastrada com sucesso.")

    } catch (error){
        return response.status(500).send()
    }

})

app.put("/conhecimentos/:id", async (request, response) => {
    const { title, description, category, level, userId } = request.body;
    const { id } = request.params;

    try{
        const oferta = await prisma.offer.findUnique({ where: { id }})

        if(!oferta){
            return response.status(404).json("Oferta não encontrada.")
        }

        const ofertaAtualizada = await prisma.offer.update({
            data: { title, description, category, level, userId },
            where: { id }
        })
        return response.status(200).json(ofertaAtualizada)

    } catch(error){
        return response.status(500).send()
    }
        
})

app.delete("/conhecimentos/:id", async (request, response) => {
    const { id } = request.params;

    try{
        const oferta = await prisma.offer.findUnique({where: { id }})

        if (!oferta){
            return response.status(404).json("Oferta não encontrada.")
        }

        const ofertaDeleted = await prisma.offer.delete({where: { id }})
        return response.status(204).send()

    } catch(error){
        return response.status(500).send()
    }
        
})

app.get("/conhecimentos", async (request, response) => {

    const { title, description, category, level, userId } = request.query;
    const offer = await prisma.offer.findMany({
        include: {user: true}
     });
     return response.status(201).json(offer)

})

app.listen(8080, () => {
    console.log("Running on port 8080")
})
