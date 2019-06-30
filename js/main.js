var UTILS = {
    randomInt: function(min, max) {
        var random = Math.floor(Math.random() * (max - min + 1)) + min;

        if (random > max) random = max;
        return random;
    },
    random2or4: function() {
        return UTILS.randomInt(1, 2) * 2; 
    },
    selectRandomBox: function(availableBoxes) {
        return availableBoxes[UTILS.randomInt(0, availableBoxes.length - 1)];
    }
}

var LISTENERS = {
    newGame: function() {
        var newGameButton = document.getElementById('new_game');
        newGameButton.addEventListener('click', function (event) {
            STATE.initMatrix();
            STATE.gameStatus = 'playing';

            RENDERERS.renderButton();
            RENDERERS.renderBox();
        });
    },
    retryGame: function() {

    },
}

var STATE = {
    matrix: [
        [0, 0, 0, 0],
        [512, 1024, 2048, 0],
        [256, 128, 64, 32],
        [2, 4, 8, 16]
    ],
    /**
     * Possible values
     * 'ready': Ready to play new game
     * 'playing': Play in progress
     * 'ended': Game ended without 2048
     * 'completed': 2048 reached
     */
    gameStatus: 'ready',
    /**
     * @param {Array} boxPos [rowIndex, colIndex] Represents box position 
     * @param {int} value Value to be filled at position, if not specified then either 2 or 4 is randomly filled
     */
    fillValueAtBox(boxPos, value = null) {
        var rowIndex = boxPos[0];
        var colIndex = boxPos[1];
        if (!value) {
            value = UTILS.random2or4();
        }
        STATE.matrix[rowIndex][colIndex] = value;
    },
    fillARandomBox() {
        var availableBoxes = STATE.getAvailableBoxes();
        var firstBox = UTILS.selectRandomBox(availableBoxes);
        STATE.fillValueAtBox(firstBox);
    },
    getAvailableBoxes() {
        var boxes = [];
        for (var rowIndex in STATE.matrix) {
            var row = STATE.matrix[rowIndex];
            for (var colIndex in row) {
                var col = row[colIndex];
                if (col === 0) {
                    boxes.push([rowIndex, colIndex]);
                }
            }
        }
        return boxes;
    },
    resetMatrix() {
        STATE.matrix = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ]
    },
    initMatrix() {
        STATE.resetMatrix();
        STATE.fillARandomBox();
        STATE.fillARandomBox();
    }
}

var RENDERERS = {
    renderBox: function() {
        var boxHTML = ``;
        for (var rowIndex in STATE.matrix) {
            var row = STATE.matrix[rowIndex];
            boxHTML += `<div class="row-2048">`;
            for (var colIndex in row) {
                var col = row[colIndex];
                boxHTML += `
                <div class="col-2048 color-${col}">
                    ${(col > 0) ? col : ''}
                </div>
                `;
            }
            boxHTML += `</div>`;
        }
        var box = document.getElementById('box_2048');
        box.innerHTML = boxHTML;
    },
    renderButton: function() {
        var buttonLabel = '';
        switch (STATE.gameStatus) {
            case 'ready':
                buttonLabel = 'New Game';
                break;
            case 'playing':
                buttonLabel = 'Reset';
                break;
            case 'ended':
                buttonLabel = 'Retry';
                break;
            case 'completed':
                buttonLabel = 'Play Again';
                break;
            default:
                console.error('Invalid Game Status');
        }
        var button = document.getElementById('new_game');
        button.innerText = buttonLabel;
    }
}

for (var x in LISTENERS) {
    var attachable = LISTENERS[x];
    if (typeof attachable === 'function') {
        attachable();
    }
}

RENDERERS.renderBox();
RENDERERS.renderButton();