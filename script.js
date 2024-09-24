// variaveis de attack/defensa
var enemy_attack = 0; // attack do inimigo
var my_attack = 0; // meu attack
var my_cure = 50; // minha defesa
var enemy_defense = 0; // defensa inimiga

// barra do inimigo e a minha barra
var enemy_bar = document.getElementById('enemy_life'); // vida do inimigo
var my_bar = document.getElementById('my_life'); // minha vida

// botoes de acao
var attack_button = document.getElementById('atacar'); // botao de atacar
var cure_button = document.getElementById('curar'); // botao de cura
var convert_button = document.getElementById('defender'); // botao de defender

// inimigos img
var enemy_img = document.getElementById('enemy'); // inimigos img

// prompt music
var prompt = document.getElementById('prompt'); // texto principal

// dialog box
var title = document.getElementById('title'); // title
var content = document.getElementById('content'); // content of dialog box

// tempo de espera
var time = 2000;

// bonus diversos
var life_bonus = 10;
var monster_count = 0;
var init_charge = false;
var charge_power = 0;
var malign_power = false; // Poder maligno do monstro
var malign_bonus = 1.4; // Aumento de poder maligno (olhe pro ultimo numero 3 = 30%)

// sounds OST
var battle = document.getElementById('battle');
var defeat = new Audio('sounds/OST/defeat.wav');
var win = new Audio('sounds/OST/victory.wav');

// sounds SFX
var sword_slice = new Audio('sounds/SFX/slice_sword.wav');
var sword_slice_crit = new Audio('sounds/SFX/slice_sword_retro.mp3');
var charging = new Audio('sounds/SFX/charging.wav');
var release = new Audio('sounds/SFX/release.wav');
var cure_sound = new Audio('sounds/SFX/cure_sound.wav');

dialog_box();

// first change oponent
var oponent_changer = Math.floor(Math.random() * 9); // 0 a 9
enemy_img.setAttribute('src', 'enemy/0' + oponent_changer + '.png');

function my_turn(choice) {
    if (enemy_bar.value > 0 && my_bar.value > 0 && choice == 1) { // ataca
        attack_button.setAttribute('disabled', '');
        cure_button.setAttribute('disabled', '');
        convert_button.setAttribute('disabled', '');

        enemy_bar.value -= my_attack = Math.floor(Math.random() * 101) + charge_power;

        if (my_attack < 70 && my_attack > 0) {
            sword_slice.play();
        } 
        if (my_attack >= 70) {
            sword_slice_crit.play();
        }

        if (my_attack != 0) {
            prompt.innerHTML = `Ataque bem <span style="color: green;">Sucedido</span>, você acertou: <span style="color: red;">` + my_attack + `</span> de dano!`;
        } else {
            prompt.innerHTML = `Seu Ataque falhou!`;
        }
    };
    if (enemy_bar.value > 0 && my_bar.value > 0 && choice == 2) { // curar
        attack_button.setAttribute('disabled', '');
        cure_button.setAttribute('disabled', '');
        convert_button.setAttribute('disabled', '');

        cureing = true
        cure_sound.play();

        charge_power = 0;

        my_bar.value -= -my_cure;

        prompt.innerHTML = `Você se <span style="color: green;">Curou</span>!`;
    };
    if (enemy_bar.value > 0 && my_bar.value > 0 && choice == 3) { // conversão
        attack_button.setAttribute('disabled', '');
        cure_button.setAttribute('disabled', '');
        convert_button.setAttribute('disabled', '');

        charging.play();

        init_charge = true;
        charge_power = 0;

        prompt.innerHTML = `Conversão <span style="color: green;">Iniciada</span>!`;
    };

    setTimeout(async () => {
        oponent_turn();
    }, time);

    if (battle.paused) {
        battle.play();
    }
}

// Função para ativar Poder Maligno no turno do oponente
function activate_malign_power() {
    if (Math.floor(Math.random() * 20) < 3) { // chance do monstro ativar o poder maligno
        malign_power = true;
        prompt.innerHTML = `<span style="color: red;">O Monstro ativa seu Poder Maligno!</span>`;
    }
};

function oponent_turn() {
    prompt.innerHTML = `Turno do <span style="color: red;">oponente</span>!`;

    activate_malign_power(); // Ativa o Poder Maligno, se tiver sorte

    setTimeout(async () => {
        if (my_bar.value > 0 && enemy_bar.value > 0) {
            // Aplicação do dano do oponente com poder maligno
            var min = Math.ceil(1);
            var max = Math.floor(101);
            var base_attack = 0;

            if (malign_power) {
                base_attack = Math.floor(Math.random() * (max - min) + min);
            } else {
                base_attack = Math.floor(Math.random() * 101);
            };
            
            enemy_attack = malign_power ? Math.floor(base_attack * malign_bonus) : base_attack;
            my_bar.value -= enemy_attack; // dano tomado com malign power
            
            if (init_charge == true) {
                charge_power = Math.floor(enemy_attack / 2);
            };

            if (init_charge == false) {
                if (enemy_attack < 70 && enemy_attack > 0) {
                    sword_slice.play();
                };
                if (enemy_attack >= 70) {
                    sword_slice_crit.play();
                };

                if (enemy_attack != 0) {
                    prompt.innerHTML = `Ataque bem <span style="color: green;">Sucedido</span>, oponente acertou: <span style="color: red">` + enemy_attack + `</span> de dano!`;
                } else {
                    prompt.innerHTML = `Ataque do oponente <span style="color: yellow;">Falhou</span>!`;
                };

            } else {
                release.play();
                prompt.innerHTML = `Convertido <span style="color: yellow;">` + charge_power + `</span> em poder <span style="color: yellow;">divino</span> de <span style="color: red;">` + enemy_attack + `</span> de dano físico!`;
            }
            
            
        };

        if (my_bar.value > 0 && enemy_bar.value > 0) {
            setTimeout(async () => {
                attack_button.removeAttribute('disabled', '');
                cure_button.removeAttribute('disabled', '');
                convert_button.removeAttribute('disabled', '');

                init_charge = false;
                cureing = false;

                prompt.innerHTML = "Seu Turno!";
            }, time);
        };

        setTimeout(async () => {
            battle_stats();
        }, time);
    }, time);
}

function battle_stats() {
    if (enemy_bar.value <= 0) {
        oponent_change();

        win.play();
        battle.pause();

        monster_count += 1;

        prompt.innerHTML = `Você Derrotou seu <span style="color: red;">Oponente</span>!`;
    };
    if (my_bar.value <= 0) {
        attack_button.setAttribute('disabled', '');
        cure_button.setAttribute('disabled', '');
        convert_button.setAttribute('disabled', '');

        defeat.play();
        defeat.loop = true;
        battle.pause();

        prompt.innerHTML = `Você foi <span style="color: red;">Derrotado!`;
    };
}

function oponent_change() {
    var oponent_changer = Math.floor(Math.random() * 9); // 0 a 9

    attack_button.setAttribute('disabled', '');
    cure_button.setAttribute('disabled', '');
    convert_button.setAttribute('disabled', '');

    setTimeout(async () => {
        attack_button.removeAttribute('disabled', '');
        cure_button.removeAttribute('disabled', '');
        convert_button.removeAttribute('disabled', '');

        battle.play();
        battle.loop = true;
        win.pause();

        life_bonus *= monster_count;

        enemy_bar.value = 300;
        my_bar.value = (300 + life_bonus);

        enemy_img.setAttribute('src', 'enemy/0' + oponent_changer + '.png');

        prompt.innerHTML = `Um <span style="color: red;">Monstro</span> aparece em sua frente!`;
    }, time * 2.5);
};

function dialog_box() { // especificação dos botoes
    attack_button.addEventListener('mouseover', function() {
        title.innerHTML = "Lançar Ataque!";
        content.innerHTML = `ataque com sua adaga para causar entre <span style="color: red">1</span> a <span style="color: red;">100</span> de dano físico. <br>Cuidado, ataques podem <span style="color: yellow;">falhar</span>!`;
    });
    convert_button.addEventListener('mouseover', function() {
        title.innerHTML = "Iniciar conversão!";
        content.innerHTML = `Converte <span style="color: yellow;">25%</span> do dano físico recebido em poder <span style="color: yellow;">divino</span> se atacar no próximo turno. Lembre-se: Isso não impede o <span style="color: red;">dano</span> no turno do oponente.`;
    });
    cure_button.addEventListener('mouseover', function() {
        title.innerHTML = "Recuperar Forças!";
        content.innerHTML = `Use um <span style="color: green;">milagre</span> de cura para regenerar <span style="color: green;">50</span> pontos de <span style="color: green;">vida</span>. <br>Não deixe a batalha te derrubar!`;
    });

    // mouse out quando ele sai volta pra quest
    attack_button.addEventListener('mouseout', function() {
        title.innerHTML = `Irina`;
        content.innerHTML = `Uma simples <span style="color: yellow;">Sacerdotisa</span>, com a missão de <span style="color: green;">salvar</span> seu <span style="color: yellow;">irmão</span>, preso pelas amarras do <span style="color: red;">Rei Demônio</span>.<br>para isso, precisa passar por diversos <span style="color: red;">Monstros</span> em seu caminho.`;
    });
    convert_button.addEventListener('mouseout', function() {
        title.innerHTML = `Irina`;
        content.innerHTML = `Uma simples <span style="color: yellow;">Sacerdotisa</span>, com a missão de <span style="color: green;">salvar</span> seu <span style="color: yellow;">irmão</span>, preso pelas amarras do <span style="color: red;">Rei Demônio</span>.<br>para isso, precisa passar por diversos <span style="color: red;">Monstros</span> em seu caminho.`;
    });
    cure_button.addEventListener('mouseout', function() {
        title.innerHTML = `Irina`;
        content.innerHTML = `Uma simples <span style="color: yellow;">Sacerdotisa</span>, com a missão de <span style="color: green;">salvar</span> seu <span style="color: yellow;">irmão</span>, preso pelas amarras do <span style="color: red;">Rei Demônio</span>.<br>para isso, precisa passar por diversos <span style="color: red;">Monstros</span> em seu caminho.`;
    });
};
