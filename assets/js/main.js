document.addEventListener('DOMContentLoaded', function() {
    // Carregar produtos do JSON e exibir na tela
    fetch('assets/produtos/produtos.json')
        .then(response => response.json())
        .then(data => {
            const produtos = data.produtos; // Pegando o array de produtos do objeto
            const produtosGrid = document.getElementById('produtos-lista');
            if (!produtosGrid) return;
            produtosGrid.innerHTML = '';
            produtos.forEach((produto, idx) => {
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
                    const nome = card.querySelector('.produto-title').innerText;
                    const imagem = card.querySelector('img').getAttribute('src');
                    let preco = card.querySelector('.valor-atual') ? card.querySelector('.valor-atual').innerText : card.querySelector('.produto-valor').innerText;
                    preco = preco.replace('R$', '').replace('.', '').replace(',', '.').trim();
                    preco = parseFloat(preco);
                    const sku = nome + imagem; // Pode ser melhorado se houver SKU real
                    const produto = {
                        nome,
                        imagem,
                        preco,
                        sku,
                        quantidade: 1
                    };
                    let carrinho = [];
                    if (localStorage.getItem('carrinho')) {
                        try {
                            carrinho = JSON.parse(localStorage.getItem('carrinho'));
                        } catch (e) {
                            carrinho = [];
                        }
                    }
                    // Verifica se já existe o produto no carrinho
                    const idx = carrinho.findIndex(item => item.nome === produto.nome && item.sku === produto.sku);
                    if (idx > -1) {
                        carrinho[idx].quantidade += 1;
                    } else {
                        carrinho.push(produto);
                    }
                    localStorage.setItem('carrinho', JSON.stringify(carrinho));
                    window.location.href = 'carrinho.html';
                });
            });
        });
});