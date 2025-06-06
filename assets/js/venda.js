// Exemplo: produto é passado via localStorage ou query string
// Aqui vamos simular pegando o produto do localStorage (pode adaptar para query string se quiser)

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Atualizando o caminho do arquivo JSON para um caminho relativo
        const response = await fetch('assets/produtos/produtos.json');
        const data = await response.json();
        const produtos = data.produtos; // Pegando o array de produtos do objeto
        
        // Pegar o ID do produto da URL
        const urlParams = new URLSearchParams(window.location.search);
        const produtoId = parseInt(urlParams.get('id')) || 1; // Default para o primeiro produto
        
        const produto = produtos.find(p => p.id === produtoId);
        
        if (produto) {
            // Preencher informações básicas
            document.getElementById('produto-imagem').src = produto.imagem;
            document.getElementById('produto-nome').textContent = produto.nome;
            document.getElementById('produto-marca').textContent = produto.marca;
            document.getElementById('produto-codigo').textContent = produto.codigo;
            document.getElementById('produto-preco').textContent = `R$ ${produto.preco.toFixed(2)}`;
            document.getElementById('produto-parcelamento').textContent = produto.parcelamento;
            document.getElementById('produto-descricao').textContent = produto.descricao;
            
            // Preencher características
            const caracteristicasList = document.getElementById('produto-caracteristicas');
            caracteristicasList.innerHTML = ''; // Limpar lista antes de adicionar
            produto.caracteristicas.forEach(caracteristica => {
                const li = document.createElement('li');
                li.textContent = caracteristica;
                caracteristicasList.appendChild(li);
            });
            
            // Preencher especificações
            const especificacoesList = document.getElementById('produto-especificacoes');
            especificacoesList.innerHTML = ''; // Limpar lista antes de adicionar
            produto.especificacoes.forEach(especificacao => {
                const li = document.createElement('li');
                li.textContent = especificacao;
                especificacoesList.appendChild(li);
            });

            // Função para adicionar ao carrinho
            function adicionarAoCarrinho() {
                let carrinho = [];
                if (localStorage.getItem('carrinho')) {
                    try {
                        carrinho = JSON.parse(localStorage.getItem('carrinho'));
                    } catch (e) {
                        carrinho = [];
                    }
                }

                const produtoCarrinho = {
                    id: produto.id,
                    nome: produto.nome,
                    marca: produto.marca,
                    imagem: produto.imagem,
                    preco: produto.preco,
                    quantidade: 1
                };

                // Verifica se já existe o produto no carrinho
                const idx = carrinho.findIndex(item => item.id === produto.id);
                if (idx > -1) {
                    carrinho[idx].quantidade += 1;
                } else {
                    carrinho.push(produtoCarrinho);
                }

                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                alert('Produto adicionado ao carrinho!');
            }

            // Função para comprar
            function comprar() {
                let carrinho = [];
                if (localStorage.getItem('carrinho')) {
                    try {
                        carrinho = JSON.parse(localStorage.getItem('carrinho'));
                    } catch (e) {
                        carrinho = [];
                    }
                }

                const produtoCarrinho = {
                    id: produto.id,
                    nome: produto.nome,
                    marca: produto.marca,
                    imagem: produto.imagem,
                    preco: produto.preco,
                    quantidade: 1
                };

                // Verifica se já existe o produto no carrinho
                const idx = carrinho.findIndex(item => item.id === produto.id);
                if (idx > -1) {
                    carrinho[idx].quantidade += 1;
                } else {
                    carrinho.push(produtoCarrinho);
                }

                localStorage.setItem('carrinho', JSON.stringify(carrinho));
                window.location.href = 'carrinho.html';
            }

            // Adicionar eventos aos botões
            document.querySelector('.comprar').addEventListener('click', comprar);
            document.querySelector('.carrinho').addEventListener('click', adicionarAoCarrinho);

        } else {
            console.error('Produto não encontrado');
            document.querySelector('.main-container').innerHTML = '<p style="color: #fff; text-align: center;">Produto não encontrado</p>';
        }
    } catch (error) {
        console.error('Erro ao carregar os dados do produto:', error);
        document.querySelector('.main-container').innerHTML = '<p style="color: #fff; text-align: center;">Erro ao carregar os dados do produto</p>';
    }
});
