document.addEventListener('DOMContentLoaded', function() {
    // Carregar produtos do JSON e exibir na tela
    fetch('assets/produtos/produtos.json')
        .then(response => response.json())
        .then(data => {
            const produtos = data.produtos; // Pegando o array de produtos do objeto
            const produtosGrid = document.getElementById('produtos-lista');
            if (!produtosGrid) return;

            // Função para renderizar os produtos
            function renderizarProdutos(produtosFiltrados = produtos) {
                produtosGrid.innerHTML = '';
                produtosFiltrados.forEach((produto, idx) => {
                    produtosGrid.innerHTML += `
                    <div class="produto-card" data-categoria="${produto.categoria}" data-idx="${idx}">
                        <div class="produto-img produto-link" style="cursor:pointer;">
                            <img src="${produto.imagem}" alt="${produto.nome}">
                            ${produto.desconto ? `<span class="discount-badge">-${produto.desconto}%</span>` : ''}
                        </div>
                        <div class="produto-info">
                            <h3 class="produto-title produto-link" style="cursor:pointer;">${produto.nome}</h3>
                            <p class="produto-desc">${produto.descricao}</p>
                            <div class="produto-valor">
                                ${produto.preco_antigo ? `<span class="valor-original">R$ ${produto.preco_antigo.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>` : ''}
                                <span class="valor-atual">R$ ${produto.preco.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                            </div>
                            <button class="btn-comprar">Comprar</button>
                        </div>
                    </div>
                    `;
                });

                // Adicionar eventos aos produtos renderizados
                adicionarEventosProdutos(produtos);
            }

            // Função para adicionar eventos aos produtos
            function adicionarEventosProdutos(produtos) {
                // Evento para abrir tela de venda ao clicar na imagem ou nome
                document.querySelectorAll('.produto-link').forEach(function(el) {
                    el.addEventListener('click', function(e) {
                        const card = el.closest('.produto-card');
                        const idx = card.getAttribute('data-idx');
                        const produto = produtos[idx];
                        localStorage.setItem('produtoSelecionado', JSON.stringify(produto));
                        window.location.href = 'venda.html';
                    });
                });

                // Adiciona evento aos botões de comprar
                document.querySelectorAll('.btn-comprar').forEach(function(btn) {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();
                        const card = btn.closest('.produto-card');
                        const idx = card.getAttribute('data-idx');
                        const produto = produtos[idx];
                        let carrinho = [];
                        if (localStorage.getItem('carrinho')) {
                            try {
                                carrinho = JSON.parse(localStorage.getItem('carrinho'));
                            } catch (e) {
                                carrinho = [];
                            }
                        }
                        // Verifica se já existe o produto no carrinho
                        const idxCarrinho = carrinho.findIndex(item => item.id === produto.id);
                        if (idxCarrinho > -1) {
                            carrinho[idxCarrinho].quantidade += 1;
                        } else {
                            carrinho.push({
                                id: produto.id,
                                nome: produto.nome,
                                imagem: produto.imagem,
                                preco: produto.preco,
                                quantidade: 1
                            });
                        }
                        localStorage.setItem('carrinho', JSON.stringify(carrinho));
                        window.location.href = 'carrinho.html';
                    });
                });
            }

            // Renderizar produtos inicialmente
            renderizarProdutos();

            // Adicionar eventos aos botões de filtro
            document.querySelectorAll('.filtro-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remover classe active de todos os botões
                    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
                    // Adicionar classe active ao botão clicado
                    this.classList.add('active');

                    const filtro = this.getAttribute('data-filter');
                    let produtosFiltrados;

                    if (filtro === 'todos') {
                        produtosFiltrados = produtos;
                    } else {
                        produtosFiltrados = produtos.filter(produto => produto.categoria === filtro);
                    }

                    renderizarProdutos(produtosFiltrados);
                });
            });
        });
});