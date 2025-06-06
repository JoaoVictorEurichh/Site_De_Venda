document.addEventListener('DOMContentLoaded', function() {
    const carrinhoLista = document.getElementById('carrinho-lista');
    const carrinhoTotal = document.getElementById('carrinho-total');
    const finalizarCompraBtn = document.getElementById('finalizar-compra');

    function renderCarrinho() {
        let carrinho = [];
        if (localStorage.getItem('carrinho')) {
            try {
                carrinho = JSON.parse(localStorage.getItem('carrinho'));
            } catch (e) {
                carrinho = [];
            }
        }

        if (carrinho.length === 0) {
            carrinhoLista.innerHTML = `
                <div class="carrinho-vazio">
                    <p>Seu carrinho está vazio</p>
                    <a href="index.html" class="voltar-compras">Voltar às Compras</a>
                </div>
            `;
            carrinhoTotal.innerHTML = '';
            finalizarCompraBtn.style.display = 'none';
            return;
        }

        let html = '';
        let total = 0;

        carrinho.forEach((item, idx) => {
            const subtotal = item.preco * item.quantidade;
            total += subtotal;

            html += `
                <div class="carrinho-item">
                    <img src="${item.imagem}" alt="${item.nome}">
                    <div class="item-info">
                        <h3>${item.nome}</h3>
                        <div class="item-preco">R$ ${item.preco.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                        <div class="item-quantidade">
                            <button class="quantidade-btn" onclick="alterarQuantidade(${idx}, -1)">-</button>
                            <span>${item.quantidade}</span>
                            <button class="quantidade-btn" onclick="alterarQuantidade(${idx}, 1)">+</button>
                        </div>
                    </div>
                    <button class="remover-item" onclick="removerItem(${idx})">Remover</button>
                </div>
            `;
        });

        carrinhoLista.innerHTML = html;
        carrinhoTotal.innerHTML = `
            <h3>Total: R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
        `;
        finalizarCompraBtn.style.display = 'block';
    }

    // Função para alterar quantidade
    window.alterarQuantidade = function(idx, delta) {
        let carrinho = JSON.parse(localStorage.getItem('carrinho'));
        carrinho[idx].quantidade = Math.max(1, carrinho[idx].quantidade + delta);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderCarrinho();
    };

    // Função para remover item
    window.removerItem = function(idx) {
        let carrinho = JSON.parse(localStorage.getItem('carrinho'));
        carrinho.splice(idx, 1);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderCarrinho();
    };

    // Finalizar compra
    finalizarCompraBtn.addEventListener('click', function() {
        alert('Compra finalizada com sucesso! Obrigado por comprar na Tática Alpha.');
        localStorage.removeItem('carrinho');
        renderCarrinho();
    });

    // Renderizar carrinho inicial
    renderCarrinho();
});