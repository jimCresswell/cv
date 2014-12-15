/**
 * Mmm, Easter Egg...
 */
(function(window){
    'use strict';

    var winningScore = 3;
    var isAttached = false;

    // Attach a new game to the DOM.
    attach();


    /**
     * Define a game using globals (I'm not sorry)
     * and attach it to the DOM.
     */
    function attach() {
        if (window.Konami && window.Pong) {
            new window.Konami(easterEgg);
        } else {
            setTimeout(attach, 1000);
        }
    }

    // Configure DOM behaviours.
    function easterEgg() {
        var pong;
        var hideClass = 'noshow';
        var wrapperEl = document.getElementById('pg-wrapper');
        wrapperEl.classList.remove(hideClass);

        // Bring game window into view.
        wrapperEl.scrollIntoView();

        // Allow up and down keys for game without moving document.
        function nope(event) {
            event.preventDefault();
        }
        window.document.addEventListener('keydown', nope, false);

        // Instructions.
        var instructionsEl = wrapperEl.getElementsByClassName('instructions')[0];
        var instructions = '<p class="title">Pong!</p>' +
                            '<p class="thanks">Pong code by <a href="https://github.com/KanoComputing/Pong.js">Kano</a>. Konami sensing by <a href="http://code.snaptortoise.com/konami-js/">snaptortoise</a>.</p>' +
                            '<p>Up arrow, down arrow, first to ' + winningScore + ' wins!<p>';
        // I'm still not sorry.
        instructionsEl.innerHTML = instructions;

        // The 'go away' button.
        var closeEl = wrapperEl.getElementsByClassName('close')[0];
        closeEl.addEventListener('click', function() {
            window.document.removeEventListener('keydown', nope);
            wrapperEl.classList.add(hideClass);
        }, true);

        // Start the game
        if (isAttached === false) {
            isAttached = true;
            pong = new window.Pong(wrapperEl);
            configureGame(pong);
        }
    }

    // Configure game behaviours.
    function configureGame(pong) {

        // Add keyboard controls for player A
        pong.players.a.addControls({
            'up': 'up',
            'down': 'down',
        });

        // Add behaviour for player B
        pong.on('update', function () {
            if (pong.players.b.y < pong.balls[0].y) {
                pong.players.b.move(1);
            } else if (pong.players.b.y > pong.balls[0].y) {
                pong.players.b.move(-1);
            }
        });

        pong.on('point', function (player) {
            var pName = (player === pong.players.a) ? 'A' : 'B';

            // Player B gets tired.
            if (pong.players.b.score > pong.players.a.score) {
                pong.players.b.speed *= 0.8;

            // Player B rallies.
            } else {
                pong.players.b.speed *= 1.25;
            }

            if (player.score >= winningScore) {
                pong.win('Player ' + pName + ' wins!');
            }
        })
    }
})(window)
