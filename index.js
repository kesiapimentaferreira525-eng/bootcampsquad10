import express from "express";
import prisma from "./PrismaClient.js";

const app = express();
app.use(express.json());

// 1. Rota para cadastrar um novo usuário (POST)
app.post("/users", async (req, res) => {
    const { name, email, phone, description } = req.body; 

    try {
        const newUser = await prisma.user.create({
            data: { name, email, phone, description }
        });
        return res.status(201).json({
            message: "Usuario cadastrado com sucesso!",
            data: newUser
        });
    } catch (error) {
        // Erro 400 se o email já existir, por exemplo
        return res.status(400).json({ error: "Erro ao cadastrar usuário." });
    }
});

// 2. Rota para buscar todos os usuários (GET)
app.get("/users", async (req, res) => {
    try {
        const list = await prisma.user.findMany({
            select: { 
                id: true,
                name: true,
                email: true,
                phone: true,
                description: true
            }
        });
        return res.status(200).json(list);
    } catch (error) {
        return res.status(500).json({ error: "Error fetching user list." });
    }
});

// 3. Rota para editar informações (PUT)
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, description } = req.body;

  try {
    // Como no seu schema o ID é String (uuid), não usamos Number(id) aqui
    const userExists = await prisma.user.findUnique({
      where: { id: id }
    });

    if (!userExists) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { name, email, phone, description }
    });

    return res.status(200).json({
      message: "Dados atualizados com sucesso!",
      data: updatedUser
    });

  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar dados do usuário." });
  }
});

// 4. Rota para remover um usuário (DELETE)
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const userToRemove = await prisma.user.findUnique({
      where: { id: id }
    });

    if (!userToRemove) {
      return res.status(404).json({ message: "Usuário não encontrado para exclusão." });
    }

    await prisma.user.delete({
      where: { id: id }
    });

    return res.status(200).json({ message: `Usuário ${userToRemove.name} removido com sucesso.` });

  } catch (error) {
    return res.status(500).json({ error: "Não foi possível remover o usuário." });
  }
});

// A porta que o trabalho pede (pode ser 3000 ou 8080,  qual prefere?)
app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
});