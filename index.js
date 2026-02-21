import "dotenv/config";
import express from "express";
import prisma from "./PrismaClient.js";

const app = express();
app.use(express.json());

/* ============================
Criar usuário (POST)
============================ */
app.post("/users", async (req, res) => {
  const { name, email, phone, description } = req.body;

  try {
    const newUser = await prisma.user.create({
      data: { name, email, phone, description }
    });

    return res.status(201).json({
      message: "Usuário cadastrado com sucesso!",
      data: newUser
    });

  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: "Erro ao cadastrar usuário." });
  }
});


/* ============================
Listar usuários (GET)
============================ */
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
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});


/* ============================
Atualizar usuário (PUT)
============================ */
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, description } = req.body;

  try {
    const userExists = await prisma.user.findUnique({
      where: { id }
    });

    if (!userExists) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, phone, description }
    });

    return res.status(200).json({
      message: "Dados atualizados com sucesso!",
      data: updatedUser
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar usuário." });
  }
});


/* ============================
Deletar usuário (DELETE)
============================ */
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const userToRemove = await prisma.user.findUnique({
      where: { id }
    });

    if (!userToRemove) {
      return res.status(404).json({ message: "Usuário não encontrado para exclusão." });
    }

    await prisma.user.delete({
      where: { id }
    });

    return res.status(204).send();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao remover usuário." });
  }
});


/* ============================
Criar conhecimento (POST)
============================ */
app.post("/conhecimentos", async (req, res) => {
  const { title, description, category, level, userId } = req.body;

  try {
    const oferta = await prisma.offer.create({
      data: { title, description, category, level, userId }
    });

    return res.status(201).json({
      message: "Oferta cadastrada com sucesso.",
      data: oferta
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao cadastrar oferta." });
  }
});


/* ============================
Atualizar conhecimento (PUT)
============================ */
app.put("/conhecimentos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, category, level, userId } = req.body;

  try {
    const oferta = await prisma.offer.findUnique({
      where: { id }
    });

    if (!oferta) {
      return res.status(404).json({ message: "Oferta não encontrada." });
    }

    const ofertaAtualizada = await prisma.offer.update({
      where: { id },
      data: { title, description, category, level, userId }
    });

    return res.status(200).json(ofertaAtualizada);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar oferta." });
  }
});


/* ============================
Deletar conhecimento (DELETE)
============================ */
app.delete("/conhecimentos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const oferta = await prisma.offer.findUnique({
      where: { id }
    });

    if (!oferta) {
      return res.status(404).json({ message: "Oferta não encontrada." });
    }

    await prisma.offer.delete({
      where: { id }
    });

    return res.status(204).send();

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao remover oferta." });
  }
});


/* ============================
Listar conhecimentos com filtros (GET)
============================ */
app.get("/conhecimentos", async (req, res) => {
  const { categoria, nivel, busca } = req.query;

  try {
    const conhecimentos = await prisma.offer.findMany({
      where: {
        category: categoria ? String(categoria) : undefined,
        level: nivel ? String(nivel) : undefined,
        OR: busca ? [
          { title: { contains: String(busca), mode: "insensitive" } },
          { description: { contains: String(busca), mode: "insensitive" } }
        ] : undefined
      },
      include: {
        user: true
      }
    });

    return res.status(200).json(conhecimentos);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao filtrar conhecimentos." });
  }
});


app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});