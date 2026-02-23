import express, { request, response } from "express"
import prisma from "./PrismaClient.js";


import 'dotenv/config' 
import { createClient } from '@supabase/supabase-js'

 //Agora o Node vai conseguir ler as variáveis do seu .env
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_ANON_KEY
)




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




app.post('/signup', async (req, res) => {
  const { email, password, name, phone, description } = req.body

  try {
    // 1. Cadastra no Supabase Auth (Gera o JWT e o ID de autenticação)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    // 2. Salva no seu banco usando o Prisma
    const newUser = await prisma.user.create({
      data: {
        id: authData.user.id, // O ID vem do Supabase Auth
        email,
        name,
        phone,
        description
      }
    })

    res.status(201).json({ message: "Usuário criado!", user: newUser })
  } catch (error) {
    res.status(400).json({ error: error.message })
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
/* ============================
Criar conhecimento (POST)
============================ */
app.post("/offers", async (req, res) => {
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
app.put("/offers/:id", async (req, res) => {
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
app.delete("/offers/:id", async (req, res) => {
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
app.get("/offers", async (req, res) => {
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
