const express = require('express');
const path = require('path');
const db = require('./db');
const app = express();
const port = 3000;

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'src')));
app.use('/css', express.static(path.join(__dirname, 'src/css')));
app.use('/js', express.static(path.join(__dirname, 'src/js')));
app.use('/images', express.static(path.join(__dirname, 'src/images')));
app.use('/html', express.static(path.join(__dirname, 'src/html')));

app.use(express.json());

// Rotas para páginas HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html', 'index.html'));
});

app.get('/sobre', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html', 'sobre.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html', 'admin.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/html', 'dashboard.html'));
});

// Rotas para moradores
app.post('/moradores', (req, res) => {
    const { nome, bloco, apartamento, telefone, email, status } = req.body;
    db.query('INSERT INTO moradores (nome, bloco, apartamento, telefone, email, status) VALUES (?, ?, ?, ?, ?, ?)',
        [nome, bloco, apartamento, telefone, email, status],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ id: result.insertId, ...req.body });
        });
});

app.get('/moradores', (req, res) => {
    db.query('SELECT * FROM moradores', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.put('/moradores/:id', (req, res) => {
    const { id } = req.params;
    const { nome, bloco, apartamento, telefone, email, status } = req.body;
    db.query('UPDATE moradores SET nome=?, bloco=?, apartamento=?, telefone=?, email=?, status=? WHERE id=?',
        [nome, bloco, apartamento, telefone, email, status, id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Morador atualizado com sucesso' });
        });
});

app.delete('/moradores/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM moradores WHERE id=?', [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Morador removido com sucesso' });
    });
});

// Rotas para veículos
app.post('/veiculos', (req, res) => {
    const { placa, modelo, cor, morador_id, box } = req.body;
    db.query('INSERT INTO veiculos (placa, modelo, cor, morador_id, box) VALUES (?, ?, ?, ?, ?)',
        [placa, modelo, cor, morador_id, box],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(201).json({ id: result.insertId, ...req.body });
        });
});

app.get('/veiculos', (req, res) => {
    db.query('SELECT * FROM veiculos', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.put('/veiculos/:id', (req, res) => {
    const { id } = req.params;
    const { placa, modelo, cor, morador_id, box } = req.body;
    db.query('UPDATE veiculos SET placa=?, modelo=?, cor=?, morador_id=?, box=? WHERE id=?',
        [placa, modelo, cor, morador_id, box, id],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Veículo atualizado com sucesso' });
        });
});

app.delete('/veiculos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM veiculos WHERE id=?', [id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Veículo removido com sucesso' });
    });
});

// Rota simples de login sem autenticação complexa
// Rota unificada para login/registro
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // Verifica se o email é válido
    if (!email.endsWith('@cloudvillage.com.br')) {
        return res.status(400).json({ 
            success: false, 
            message: 'Apenas emails @cloudvillage.com.br são permitidos' 
        });
    }

    // Verificação simples (não recomendado para produção)
    if (email && password) {
        // Aqui você poderia adicionar a lógica para salvar no banco de dados
        // se quiser persistir os usuários
        res.json({ 
            success: true, 
            message: 'Login/Registro bem-sucedido' 
        });
    } else {
        res.status(400).json({ 
            success: false, 
            message: 'Email e senha são obrigatórios' 
        });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});