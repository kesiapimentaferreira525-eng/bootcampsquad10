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

app.listen(8080, () => {
    console.log("Running on port 8080")
})
