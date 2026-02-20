import express from 'express';
import cors from 'cors';

const app = express();

// --- MIDDLEWARES (O que será avaliado na sua tarefa) ---
app.use(cors()); 
app.use(express.json()); // Permite que o servidor entenda o JSON do Thunder Client

// --- ROTA DE TESTE ---
app.post('/pessoas', async (req, res) => {
    const { nome, email } = req.body;
    res.status(201).json({ mensagem: `Pessoa ${nome} recebida pelo servidor!` });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));