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
var defend_button = document.getElementById('defender'); // botao de defender

// inimigos img
var enemy_img = document.getElementById('enemy'); // inimigos img

// prompt music
var prompt = document.getElementById('prompt'); // texto

// tempo de espera
var time = 2000;

// bonus diversos
var life_bonus = 10;
var monster_count = 0;

// sounds OST
var battle = document.getElementById('battle');
var defeat = new Audio('sounds/OST/defeat.wav');
var win = new Audio('sounds/OST/victory.wav');

// sounds SFX
var sword_slice = new Audio('sounds/SFX/slice_sword.wav');
var sword_slice_crit = new Audio('sounds/SFX/slice_sword_retro.mp3');
var shield = new Audio('sounds/SFX/shield_hit.wav');
var cure_sound = new Audio('sounds/SFX/cure_sound.wav');

function my_turn(choice) {
    if (enemy_bar.value > 0 && my_bar.value > 0 && choice == 1) { // ataca
        attack_button.setAttribute('disabled', '');
        cure_button.setAttribute('disabled', '');
        defend_button.setAttribute('disabled', '');
        
        enemy_bar.value -= my_attack = Math.floor(Math.random() * 100);

        if (my_attack < 70 && my_attack > 0) {
            sword_slice.play();
        } 
        if (my_attack >= 70) {
            sword_slice_crit.play();
        }

        if (my_attack != 0) {
            prompt.innerHTML = "Ataque bem Sucedido, você deu: " + my_attack + " de dano!";
        } else {
            prompt.innerHTML = "Seu Ataque falhou!";
        }
    };
    if (enemy_bar.value > 0 && my_bar.value > 0 && choice == 2) { // curar
        attack_button.setAttribute('disabled', '');
        cure_button.setAttribute('disabled', '');
        defend_button.setAttribute('disabled', '');

        cureing = true

        my_bar.value -= -my_cure;

        cure_sound.play();

        prompt.innerHTML = "Você se Curou!";
    };
    if (enemy_bar.value > 0 && my_bar.value > 0 && choice == 3) { // defender
        attack_button.setAttribute('disabled', '');
        cure_button.setAttribute('disabled', '');
        defend_button.setAttribute('disabled', '');

        shield.play();

        prompt.innerHTML = "Você usou Defender!";
    };

    setTimeout(async () => {
        oponent_turn();
    }, time);

    if (battle.paused) {
        battle.play();
    }
}

function oponent_turn(choice) {
    prompt.innerHTML = "Turno do oponente!";

    setTimeout(async () => {
        if (my_bar.value > 0 && enemy_bar.value > 0 && choice != 3) {

            my_bar.value -= enemy_attack = Math.floor(Math.random() * 100); // dano tomado(annnnn)

            if (enemy_attack < 70 && enemy_attack > 0) {
                sword_slice.play();
            } 
            if (enemy_attack >= 70) {
                sword_slice_crit.play();
            }
            
            if (enemy_attack != 0) {
                prompt.innerHTML = "Ataque bem Sucedido, oponente deu: " + enemy_attack + " de dano!";
            } else {
                prompt.innerHTML = "Ataque do oponente falhou!";
            }
        }
        if (my_bar.value > 0 && enemy_bar.value > 0) {
            setTimeout(async () => {
                attack_button.removeAttribute('disabled', '');
                cure_button.removeAttribute('disabled', '');
                defend_button.removeAttribute('disabled', '');
        
                prompt.innerHTML = "Seu Turno!";
            }, time);
        }

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

        prompt.innerHTML = "Você Derrotou seu Oponente!";
    };
    if (my_bar.value <= 0) {
        attack_button.setAttribute('disabled', '');
        cure_button.setAttribute('disabled', '');
        defend_button.setAttribute('disabled', '');

        defeat.play();
        defeat.loop = true;
        battle.pause();

        prompt.innerHTML = "Você foi Derrotado!";
    };
}

function oponent_change() {
    var oponent_changer = Math.floor(Math.random() * 9); // 0 a 9

    attack_button.setAttribute('disabled', '');
    cure_button.setAttribute('disabled', '');
    defend_button.setAttribute('disabled', '');

    setTimeout(async () => {
        attack_button.removeAttribute('disabled', '');
        cure_button.removeAttribute('disabled', '');
        defend_button.removeAttribute('disabled', '');

        battle.play();
        battle.loop = true;
        win.pause();

        life_bonus *= monster_count;

        enemy_bar.value = 250;
        my_bar.value = (250 + life_bonus);

        enemy_img.setAttribute('src', 'enemy/0' + oponent_changer + '.png');

        prompt.innerHTML = "Um monstro aparece em sua frente!";
    }, time * 2.5);
}
