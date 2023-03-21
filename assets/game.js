const selectors = {
    boardContainer: document.querySelector('.board-container'),
    board: document.querySelector('.board'),
    moves: document.querySelector('.moves'),
    timer: document.querySelector('.timer'),
    start: document.querySelector('button'),
    win: document.querySelector('.win')
}

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
    flips: 0
}

const shuffle = array => {
    const clonedArray = [...array]

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}

const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}

const generateGame = () => {
    const dimensions = selectors.board.getAttribute('data-dimension')

    if (dimensions % 2 !== 0) {
        throw new Error("The dimension of the board must be an even number.")
    }
   
     let arr = ['https://avatars.mds.yandex.net/i?id=58791478b4873581b873d9c669f01a97f4c3772b-8496930-images-thumbs&n=13','https://static.wikia.nocookie.net/futurediary/images/4/4c/Mirai_Nikki_-_01_-_Large_27.jpg/revision/latest?cb=20120421083527', 'https://pp.userapi.com/c841425/v841425138/8b0a5/Wm4jn17adUw.jpg', 'https://static.wikia.nocookie.net/futurediary/images/6/68/Future-Diary-Amano-Yukiteru-Cosplay-Costume-Version-01-4.jpg/revision/latest?cb=20140725221437&path-prefix=ru', 'https://fanfics.me/images/fandoms_heroes/368-1456830468.jpg', 'http://purmix.ru/images/uroki/karand/anime/kak_narisovat_cubaki_kasugano_iz_anime_dnevnik_budushego.jpg', 'https://static.wikia.nocookie.net/futurediary/images/0/05/Mirai_Nikki_-_06_-_Large_36.jpg/revision/latest/scale-to-width/360?cb=20150531212020&path-prefix=ru']
    const emojis = ['https://avatars.mds.yandex.net/i?id=58791478b4873581b873d9c669f01a97f4c3772b-8496930-images-thumbs&n=13', 'https://static.wikia.nocookie.net/futurediary/images/4/4c/Mirai_Nikki_-_01_-_Large_27.jpg/revision/latest?cb=20120421083527', 'https://pp.userapi.com/c841425/v841425138/8b0a5/Wm4jn17adUw.jpg', 'https://static.wikia.nocookie.net/futurediary/images/6/68/Future-Diary-Amano-Yukiteru-Cosplay-Costume-Version-01-4.jpg/revision/latest?cb=20140725221437&path-prefix=ru', 'https://fanfics.me/images/fandoms_heroes/368-1456830468.jpg', 'http://purmix.ru/images/uroki/karand/anime/kak_narisovat_cubaki_kasugano_iz_anime_dnevnik_budushego.jpg', 'https://static.wikia.nocookie.net/futurediary/images/0/05/Mirai_Nikki_-_06_-_Large_36.jpg/revision/latest/scale-to-width/360?cb=20150531212020&path-prefix=ru', 'https://static.wikia.nocookie.net/futurediary/images/0/05/Mirai_Nikki_-_06_-_Large_36.jpg/revision/latest/scale-to-width/360?cb=20150531212020&path-prefix=ru', 'https://data.cyclowiki.org/images/1/1a/%D0%9C%D0%B0%D1%80%D1%83%D0%BA%D0%BE_%D0%98%D0%BA%D1%83%D1%81%D0%B0%D0%B1%D0%B0_%D0%B8_%D0%90%D0%B9_%D0%9C%D0%B8%D0%BA%D0%B0%D0%BC%D0%B8.jpg', 'https://static.wikia.nocookie.net/anime-characters-fight/images/0/09/%D0%A9%D1%88%D0%B3%D0%BD%D1%82%D0%B8%D0%B5%D0%BA%D0%BC%D0%BF%D1%83%D0%B034.png/revision/latest?cb=20220713183220&path-prefix=ru']
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2) 
    const items = shuffle([...picks, ...picks])
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <img class="card-back" src="${item}">
                </div>
            `).join('')}
       </div>
    `
    
    const parser = new DOMParser().parseFromString(cards, 'text/html')

    selectors.board.replaceWith(parser.querySelector('.board'))
}

const startGame = () => {
    state.gameStarted = true
    selectors.start.classList.add('disabled')

    state.loop = setInterval(() => {
        state.totalTime++

        selectors.moves.innerText = `${state.totalFlips} moves`
        selectors.timer.innerText = `time: ${state.totalTime} sec`
    }, 1000)
}

const flipBackCards = () => {
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}

const flipCard = card => {
    state.flippedCards++
    state.flips+=0.5
    state.totalFlips = Math.floor(state.flips)

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')

        if (flippedCards[0].innerHTML === flippedCards[1].innerHTML) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }

    // If there are no more cards that we can flip, we won the game
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            selectors.boardContainer.classList.add('flipped')
            selectors.win.innerHTML = `
                <span class="win-text">
                you lose Hahahahah that was a joke, you won, well done<br />
                    with <span class="highlight">${state.totalFlips}</span> moves<br />
                    under <span class="highlight">${state.totalTime}</span> seconds
                </span>
            `

            clearInterval(state.loop)
        }, 1000)
    }
}

const attachEventListeners = () => {
    document.addEventListener('click', event => {
        const eventTarget = event.target
        const eventParent = eventTarget.parentElement

        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent)
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame()
        }
    })
}

generateGame()
attachEventListeners()