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
    const { title, content, categoria, nivel, userId } = request.body;

    try{

        const ofertas = await prisma.post.create({
            data: { title, content, categoria, nivel, userId }
        })
        return response.status(200).json("Oferta cadastrada com sucesso.")

    } catch (error){
        return response.status(500).send()
    }

})

app.put("/conhecimentos/:id", async (request, response) => {
    const { title, content, categoria, nivel, userId } = request.body;
    const { id } = request.params;

    const oferta = await prisma.post.findUnique({ where: { id }})

    if(!oferta){
        return response.status(404).json("Oferta não encontrada.")
    }

    const ofertaAtualizada = await prisma.post.update({
        data: { title, content, categoria, nivel, userId },
        where: { id }
    })
    return response.status(200).json(ofertaAtualizada)
})

app.delete("/conhecimentos/:id", async (request, response) => {
    const { id } = request.params;

    const oferta = await prisma.post.findUnique({where: { id }})

    if (!oferta){
        return response.status(404).json("Post não encontrado.")
    }

    const ofertaDeleted = await prisma.post.delete({where: { id }})
    return response.status(204).send()
})

app.get("/conhecimentos", async (request, response) => {

  const { categoria, nivel, busca } = request.query;

  try {
    const conhecimentos = await prisma.post.findMany({
      where: {
        
        categoria: categoria ? String(categoria) : undefined,
        
        nivel: nivel ? String(nivel) : undefined,

        OR: busca ? [
          { titulo: { contains: String(busca) } },
          { descricao: { contains: String(busca) } }
        ] : undefined
      },
      include: {
        userPost: true 
      }
    });

    return response.json(conhecimentos); 
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Erro ao filtrar conhecimentos" });
  }
});

app.listen(8080, () => {
    console.log("Running on port 8080")
})
