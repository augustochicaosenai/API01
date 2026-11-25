//meu teste

import express from 'express';
import{produtos} from './produto_mono.js'

const app = express()
const PORT =3000;

//Middleware para interpretar JSON no corpo das requisições

app.use(express.json());

//Rota GET - listar TODOS os produtos
app.get('/produtos', (req,res) =>{
    res.status(200).json(produtos);
});

//Rota GET - buscar produto por ID

app.get('/produtos/:id',(req,res) =>{
    const id = parseInt(req.params.id);
    const produto =produtos.find(p => p.id ===id);

    if(produto){
        res.status(200).json(produto);
    }else{
        res.status(404).json({mensagem: `Produto ${id} não encontrado`});
    }
})

app.get('/produtos/categoria/:cat',(req,res) =>{
   const cat =(req.params.cat);
    const produtocat =produtos.filter(c => c.categoria ===cat);

    if(produtocat){
        res.status(200).json(produtocat);
    }else{
        res.status(404).json({mensagem:`Produto não encontrado`});
    }
})

app.post('/produtos',(req,res) =>{
    const{ nome,preco,estoque,categoria} =req.body;

    if(!nome || preco === undefined || estoque === undefined || !categoria){
        return res.status(400).json({
            mensagem: 'Todos os campos (nome,preco, estoque, categoria) são obrigatorios.'
        })
    }

    const novoProduto = {
    id: produtos.length + 1,
    nome,
    preco: parseFloat(preco),
    estoque: parseInt(estoque),
    categoria
};

    produtos.push(novoProduto);

    res.status(201).json(novoProduto);
})

app.put('/produtos/:id' , (req,res) =>{
    const id = parseInt(req.params.id);
    const {nome, preco, estoque,categoria} = req.body;

    const index = produtos.findIndex(p => p.id === id);

    if(index === -1){
        return res.status(404).json({mensagem:`Produto com Id ${id} não encontrado para atualização`});
    }

    if (!nome || preco === undefined || estoque === undefined || !categoria){
        return res.status(400).json({
            mensagem: `Todos os campos (nome, preco, estoque, categoria) devem ser informados`
        });
    }

    produtos[index] = {
        id,
        nome,
        preco:parseFloat(preco),
        estoque:parseInt(estoque),
        categoria
    };

    res.status(200).json(produtos[index]);
});

app.delete('/produtos/:id', (req,res) =>{
    const id = parseInt(req.params.id);

    const index = produtos.findIndex(p => p.id === id);

    if( index === -1){
        return res.status(404).json({mensagem:`Produto com ID ${id} não encontrado para exclusão`})
    }

    const[produtoRemovido] = produtos.splice(index,1);

    res.status(200).json({
        mensagem:`Produto com ID ${id} removido com sucesso.`,
        produto: produtoRemovido
    });
})

//Inicialização do servidor HTTP
app.listen(PORT,() =>{
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Acesse http://localhost:${PORT}/produtos para testar`)
})