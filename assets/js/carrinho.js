document.addEventListener('DOMContentLoaded', function() {
    const carrinhoLista = document.getElementById('carrinho-lista'); // Lista de itens do carrinho
    const carrinhoTotal = document.getElementById('carrinho-total'); // Total do carrinho
    const finalizarCompraBtn = document.getElementById('finalizar-compra'); // Botão de finalizar compra

    function renderCarrinho() {
        let carrinho = []; // armazenar os itens
        if (localStorage.getItem('carrinho')) { // Verifica se existe um carrinho no localStorage
            try {
                carrinho = JSON.parse(localStorage.getItem('carrinho'));
            } catch (e) {
                carrinho = []; // define o carrinho como vazio
            }
        }

        if (carrinho.length === 0) { // se o carrinho estiver vazio
            carrinhoLista.innerHTML = `
                <div class="carrinho-vazio">
                    <p>Seu carrinho está vazio</p>
                    <a href="index.html" class="voltar-compras">Voltar às Compras</a>
                </div>
            `;
            carrinhoTotal.innerHTML = ''; // Limpa o total do carrinho
            finalizarCompraBtn.style.display = 'none'; // Esconde o botão de finalizar compra
            return;
        }

        let html = ''; // armazenar o HTML do carrinho
        let total = 0; // Variável para armazenar o total do carrinho

         // Calcula o subtotal do item
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

        carrinhoLista.innerHTML = html; // Atualiza o HTML do carrinho
        carrinhoTotal.innerHTML = `
            <h3>Total: R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</h3>
        `;
        finalizarCompraBtn.style.display = 'block'; // Exibe o botão de finalizar compra
    }

    // Função para alterar quantidade
    window.alterarQuantidade = function(idx, delta) {
        let carrinho = JSON.parse(localStorage.getItem('carrinho')); // Converte o carrinho para um array
        carrinho[idx].quantidade = Math.max(1, carrinho[idx].quantidade + delta); // Atualiza a quantidade do item
        localStorage.setItem('carrinho', JSON.stringify(carrinho)); // Salva o carrinho no localStorage
        renderCarrinho();
    };

    // Função para remover item
    window.removerItem = function(idx) {
        let carrinho = JSON.parse(localStorage.getItem('carrinho'));
        carrinho.splice(idx, 1); // Remove o item
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        renderCarrinho();
    };

    renderCarrinho();
});

// Modal de Finalização
const modal = document.getElementById('modal-finalizar');
const btnFinalizar = document.getElementById('finalizar-compra');
const closeModal = document.getElementById('close-modal');
const formFinalizar = document.getElementById('form-finalizar');
const pagamentoSelect = document.getElementById('pagamento');
const pagamentoInfo = document.getElementById('pagamento-info');

btnFinalizar.addEventListener('click', function(e) {
    e.preventDefault();
    modal.classList.add('active');
});

closeModal.addEventListener('click', function() {
    modal.classList.remove('active');
});

window.onclick = function(event) {
    if (event.target === modal) {
        modal.classList.remove('active');
    }
};

// Exibe campos extras conforme a forma de pagamento
pagamentoSelect.addEventListener('change', function() {
    let html = '';
    if (this.value === 'credito') {
        html = `
            <label for="numero-cartao">Número do Cartão:</label>
            <input type="text" id="numero-cartao" required maxlength="19" placeholder="0000 0000 0000 0000">
            <label for="validade">Validade:</label>
            <input type="text" id="validade" required maxlength="5" placeholder="MM/AA">
            <label for="cvv">CVV:</label>
            <input type="text" id="cvv" required maxlength="4" placeholder="CVV">
        `;
    } else if (this.value === 'debito') {
        html = `
            <label for="numero-cartao">Número do Cartão:</label>
            <input type="text" id="numero-cartao" required maxlength="19" placeholder="0000 0000 0000 0000">
            <label for="validade">Validade:</label>
            <input type="text" id="validade" required maxlength="5" placeholder="MM/AA">
        `;
    } else if (this.value === 'pix') {
        html = `<p style="color:#4CAF50;">Você receberá um QR Code para pagamento após confirmar o pedido.</p>`;
    } else if (this.value === 'boleto') {
        html = `<p style="color:#ff6600;">O boleto será gerado após a confirmação do pedido.</p>`;
    }
    pagamentoInfo.innerHTML = html;
});

// Submissão do formulário
formFinalizar.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Pedido realizado com sucesso! Em breve você receberá as instruções de pagamento.');
    modal.classList.remove('active');
    localStorage.removeItem('carrinho');
    location.reload();
});