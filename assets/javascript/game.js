var characters, gameStatus;

function gameStart() {
    characters = resetChars();
    gameStatus = resetGameStatus();
    deployChars();
}

function resetChars() {
    return {
        'padme': { name: 'Princess Padme', healthPoints: 120, attackPower: 10, imageUrl: 'assets/images/padme.jpg', hitsReceived: 20 },
        'lukeSkyWalker': { name: 'Luke Skywalker', healthPoints: 100, attackPower: 18, imageUrl: 'assets/images/luke.jpg', hitsReceived: 10 },
        'emporerPalpatine': { name: 'Emporer Palpatine', healthPoints: 160, attackPower: 10, imageUrl: 'assets/images/emporer.png', hitsReceived: 30 },
        'rtwoDtwo': { name: 'R2D2', healthPoints: 200, attackPower: 8, imageUrl: 'assets/images/r2d2.jpg', hitsReceived: 35 }
    }
}

function resetGameStatus() { return { chosenChar: null, chosenDef: null, enemiesRemaining: 0, attackTotal: 0 } };

function spawnCharDiv(character, key) {
    var charDiv = $("<div class='character' data-name='" + key + "'>")
    var charName = $("<div class='character-name'>").text(character.name)
    var charImage = $("<img alt='character' class='character-image'>").attr('src', character.imageUrl)
    var charHealth = $("<div class='character-health'>").text(character.health)
    charDiv.append(charName).append(charImage).append(charHealth)
    return charDiv
}

function deployChars() {
    console.log('deploying characters');
    var keys = Object.keys(characters);
    for (var i = 0; i < keys.length; i++) {
        var charKey = keys[i]
        var character = characters[charKey]
        var charDiv = spawnCharDiv(character, charKey)
        $('#character-area').append(charDiv)
    }
}

function spawnOpponents(selectedCharKey) {
    var charKeys = Object.keys(characters);
    for (var i = 0; i < charKeys.length; i++) {
        if (charKeys[i] !== selectedCharKey) {
            var oppKey = charKeys[i]
            var opp = characters[oppKey]
            var oppDiv = spawnCharDiv(opp, oppKey)
            $(oppDiv).addClass('enemy')
            $('#available-to-attack-section').append(oppDiv)
        }
    }
}

function spawnEnemySelection() {
    $('.enemy').on('click.enemySelect', function() {
        console.log('opponent chosen')
        var enKey = $(this).attr('data-name')
        gameStatus.chosenDef = characters[enKey]
        $('#defender').append(this)
        $('attack-button').show()
        $('.enemy').off('click.enemySelect')
    })
}

function attack(attackTotal) {
    console.log('attacking defender in progress')
    gameStatus.chosenDef.healthPoints -= gameStatus.chosenChar.health * attackTotal
}

function defend() {
    console.log('defense of attacker in progress')
    gameStatus.chosenChar.healthPoints -= gameStatus.chosenChar.health * hitsReceived
}

function didCharDie(character) {
    console.log('did your character die?')
    return character.healthPoints <= 0
}

function gameResultW() {
    console.log('did you win the game?')
    return gameStatus.enemiesRemaining === 0
}

function checkAttackPhaseComplete() {
    if (didCharDie(gameStatus.chosenChar)) {
        alert('Pwned by ' + gameStatus.chosenDef.name + '. Press the reset button to try again.')
        $('#selected-character').empty()
        $('#reset-button').show()
        return true
    } else if (didCharDie(gameStatus.chosenDef)) {
        console.log('defender has died')
        gameStatus.enemiesRemaining--
            $('#defender').empty()
        if (gameResultW()) {
            alert('The force was with you, gz bud, press reset to play again')
            $('#reset-button').show()
        } else {
            alert('You pwned ' + gameStatus.chosenDef.name + '! Choose a new enemy to pwn')
            spawnEnemySelection()
        }
        return true
    }
    return false
}

function blankDivs() {
    $('#selected-character').empty()
    $('#defender').empty()
    $('#available-to-attack-section .enemy').empty()
    $('#character-area').empty()
    $('characters-section').show()
}

$(document).ready(function() {
    $('character-area').on('click', '.character', function() {
        var chosenKey = $(this).attr('data-name')
        gameStatus.chosenChar = characters[chosenKey]
        console.log('character selected')
        $('#selected-character').append(this)
        spawnOpponents(chosenKey)
        $('#characters-section').hide()
        gameStatus.enemiesRemaining = Object.keys(characters).length - 1
        spawnEnemySelection()
    })
    $('#attack-button').on('click.attack', function() {
        console.log('attack button pressed')
        gameStatus.numAttacks++
            attack(gameStatus.numAttacks)
        defend()
        $('#selected-character .character-health').text(gameStatus.chosenChar.healthPoints)
        $('#defender .character-health').text(gameStatus.chosenDef.healthPoints)
        if (checkAttackPhaseComplete()) { $(this).hide() }
    })
    $('#reset-button').on('click.reset', function() {
        console.log('reset game in progress')
        blankDivs()
        $(this).hide()
        gameStart()
    })
    gameStart()

});