const termos = ['JESUS', 'AMADOS', 'DEUS', 'AMOR', 'PAZ', 'FÉ', 'VIDA'];
const dicas = {
    'JESUS': 'O Salvador do mundo.',
    'AMADOS': 'Assim somos chamados por Deus.',
    'DEUS': 'Criador dos céus e da terra.',
    'AMOR': 'A maior virtude de todas.',
    'PAZ': 'O que excede todo entendimento.',
    'FÉ': 'A certeza das coisas que se esperam.',
    'VIDA': 'Presente divino para todos nós.'
};

let tentativasRestantes = 3;
let gameOver = false;
let indiceAtual = 0;
let segredo = termos[indiceAtual];

const elemGame = document.querySelector('#game');

let elemPalavra; // Variável global
let elemLetra;   // Variável global

// Função para criar o tabuleiro
function criarTabuleiro() {
    elemGame.innerHTML = ''; // Limpa o jogo anterior
    gameOver = false;

    const elemTabuleiro = document.createElement('div');
    elemTabuleiro.id = 'tabuleiro';
    elemGame.append(elemTabuleiro);

    elemPalavra = document.createElement('div'); // Atualiza a variável global
    elemPalavra.className = 'palavra';

    for (let j = 0; j < segredo.length; j++) {
        const letra = document.createElement('span');
        letra.className = 'letra';

        // Mostra a última letra do segredo
        if (j === segredo.length - 1) {
            letra.textContent = segredo[j];
            letra.classList.add('letra-revelada');
        }

        elemPalavra.append(letra);
    }

    elemTabuleiro.append(elemPalavra);

    elemPalavra.id = 'cursor-palavra';
    elemLetra = elemPalavra.firstChild; // Atualiza a variável global corretamente
    elemLetra.id = 'cursor-letra';

    // Adiciona uma div com a dica correta
    const elemDica = document.createElement('div');
    elemDica.id = 'dica';
    elemDica.className = 'dica-palavra';
    elemDica.textContent = `Dica: ${dicas[segredo] || 'Descubra a palavra secreta!'}`;

    elemGame.append(elemDica);
}


document.addEventListener('keydown', function (event) {
    if (gameOver) return;

    let elemAtualizado = null;

    if (event.key === 'ArrowLeft') {
        elemAtualizado = elemLetra.previousSibling;
    } else if (event.key === 'ArrowRight') {
        elemAtualizado = elemLetra.nextSibling;
    } else if (event.key.match(/^[a-zA-Z]$/)) {
        if (elemLetra !== elemPalavra.lastChild) {
            elemLetra.textContent = event.key.toUpperCase();
            elemAtualizado = elemLetra.nextSibling;
        }
    } else if (event.key === 'Backspace') {
        if (elemLetra !== elemPalavra.lastChild) {
            elemLetra.textContent = '';
        }
        elemAtualizado = elemLetra.previousSibling;
    } else if (event.key === 'Delete') {
        if (elemLetra !== elemPalavra.lastChild) {
            elemLetra.textContent = '';
        }
    }

    if (elemAtualizado) {
        elemLetra.id = '';
        elemAtualizado.id = 'cursor-letra';
        elemLetra = elemAtualizado;
    }

    if (event.key === 'Enter') {
        const tentativa = Array.from(elemPalavra.children).map(span => span.textContent).join('');

        if (tentativa.length !== segredo.length) {
            alert('Tentativa inválida!');
            return;
        }

        for (let i = 0; i < segredo.length; i++) {
            const elemLetraAtual = elemPalavra.children[i];

            if (tentativa[i] === segredo[i]) {
                elemLetraAtual.classList.add('letra-correta');
            } else if (segredo.includes(tentativa[i])) {
                elemLetraAtual.classList.add('letra-existe');
            } else {
                elemLetraAtual.classList.add('letra-inexistente');
            }
        }

        if (tentativa === segredo) {
            alert('😎 Você acertou!');
            proximaPalavra();
        } else {
            tentativasRestantes--;
            if (tentativasRestantes > 0) {
                alert(`Errou! Você tem mais ${tentativasRestantes} tentativas.`);

                // Reinicia apenas a tentativa, sem mudar a palavra
                criarTabuleiro();
            } else {
                alert('Você errou! Mudando para a próxima palavra.');
                proximaPalavra();
            }
        }
    }
});

// Função para avançar para a próxima palavra
function proximaPalavra() {
    indiceAtual = (indiceAtual + 1) % termos.length; // Vai para a próxima palavra ou reinicia no começo
    segredo = termos[indiceAtual];
    tentativasRestantes = 3;
    criarTabuleiro();
}

// Criar um input de texto pequeno para capturar toques no celular
const inputHidden = document.createElement('input');
inputHidden.type = 'text';
inputHidden.style.position = 'absolute';
inputHidden.style.opacity = '0';
inputHidden.style.width = '1px';
inputHidden.style.height = '1px';
inputHidden.style.border = 'none';
inputHidden.style.outline = 'none';
inputHidden.style.zIndex = '-1';
document.body.appendChild(inputHidden);

// Função para ativar o teclado virtual no celular
function ativarTecladoMovel(letra) {
    inputHidden.style.left = `${letra.getBoundingClientRect().left}px`;
    inputHidden.style.top = `${letra.getBoundingClientRect().top}px`;
    inputHidden.value = ''; // Limpa qualquer valor anterior
    inputHidden.focus(); // Abre o teclado no celular
}

// Adicionar evento de toque para ativar o teclado no celular
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('letra')) {
        elemLetra = event.target;
        ativarTecladoMovel(elemLetra);
    }
});

// Capturar entrada do teclado virtual
inputHidden.addEventListener('input', function () {
    if (elemLetra && elemLetra !== elemPalavra.lastChild) {
        elemLetra.textContent = inputHidden.value.toUpperCase();
        inputHidden.value = ''; // Limpa o campo após digitar
        elemLetra = elemLetra.nextSibling || elemLetra;
    }
});


// Inicia o jogo
criarTabuleiro();
