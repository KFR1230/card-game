
const card = document.querySelector(".card")
const Symbols = ['https://assets-lighthouse.alphacamp.co/uploads/image/file/17989/__.png',//黑桃
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17992/heart.png',//愛心
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17991/diamonds.png', //菱形
  'https://assets-lighthouse.alphacamp.co/uploads/image/file/17988/__.png'//沒花
]

const GAME_STATE = {
  FirstCardAwaits: "FirstCardAwaits",
  SecondCardAwaits: "SecondCardAwaits",
  CardsMatchFailed: "CardMatchFailed",
  CardsMatched: "CardMatched",
  GameFinished: "GameFinished",
}

const unility = {
  //洗牌
  randomNumberIndex(count) {
    const number = Array.from(Array(count).keys())
    for (let index = number.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index + 1));
      [number[index], number[randomIndex]] = [number[randomIndex], [number[index]]]
    }
    return number
  }
}

const view = {
  getCardElement(index) {
    return `<div data-index=${index} class="card back"></div>`
  }
  ,
  getCardContent(index) {
    const symbol = Math.floor(index / 13)
    const number = this.transform((index % 13) + 1)
    return `<p>${number}</p>
    <img src='${Symbols[symbol]}' alt="">
    <p>${number}</p>`
  }
  ,
  displayCards(indexes) {
    const rootElement = document.querySelector("#cards")
    rootElement.innerHTML = indexes.map((number) => this.getCardElement(number)).join("")
  },
  transform(number) {
    switch (number) {
      case 1:
        return "A"
      case 11:
        return "J"
      case 12:
        return "Q"
      case 13:
        return "K"
      default:
        return number
    }
  }
  ,
  flipCards(...cards) {
    // console.log(card)
    cards.map((card) => {
      if (card.classList.contains("back")) {
        card.classList.remove("back")
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        // console.log(card)
        return
      } else {
        card.classList.add("back")
        card.innerHTML = null
        // console.log(card)
      }
    })
  },
  addPairs(...cards) {
    cards.map((card) =>
      card.classList.add("paired")
    )
  },
  renderScore(score) {
    document.querySelector(".score").textContent = `score: ${score}`
  },
  renderTried(tried) {
    document.querySelector(".tried").textContent = `You've tried : ${tried} times.`
  },
  appendWrongAnimation(...cards) {
    cards.map((card) => {
      card.classList.add("wrong")
      card.addEventListener("animationend", event =>
        card.classList.remove("wrong"), { once: true })
    })
  },
  showGameFinished() {
    const div = document.createElement("div")
    div.classList.add("completed")
    div.innerHTML = `<p>Complete!</p>
                      <p>Score:${modal.score}</p>
                      <p>You've tried:${modal.tried}</p>
                      <p class="again">again</p>`
    const header = document.querySelector("#header")
    header.before(div)
    const again = document.querySelector(".again")
    again.addEventListener("click", this.appendResetGame)
  },
  appendResetGame(event) {
    const again = document.querySelector(".again")
    again.classList.add("reset")
    setTimeout(controller.resetGame, 1000)
  }
}

const modal = {
  revealedCard: [],
  isRevealedCardsMatched(card) {
    return Number(this.revealedCard[0].dataset.index) % 13 === Number(this.revealedCard[1].dataset.index) % 13
  },
  score: 0,
  tried: 0,
}

const controller = {
  currentState: "FirstCardAwaits",
  //洗牌後的５２張牌
  generateCards(index) {
    view.displayCards(unility.randomNumberIndex(52))
  },
  //判斷２張牌數字是否相同
  dispatchCardAction(card) {
    if (!card.classList.contains("back")) {
      return
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardAwaits:
        view.flipCards(card)
        modal.revealedCard.push(card)
        this.currentState = GAME_STATE.SecondCardAwaits
        break
      case GAME_STATE.SecondCardAwaits:
        view.renderTried(++modal.tried)
        view.flipCards(card)
        modal.revealedCard.push(card)
        if (modal.isRevealedCardsMatched()) {
          view.renderScore(modal.score += 10)
          this.currentState = GAME_STATE.CardsMatched
          view.addPairs(...modal.revealedCard)
          modal.revealedCard = []
          if (modal.score === 260) {
            console.log("showGameFinshed")
            this.currentState = GAME_STATE.GameFinished
            view.showGameFinished()
            return
          }
          this.currentState = GAME_STATE.FirstCardAwaits
        } else {
          this.currentState = GAME_STATE.CardsMatchFailed
          console.log("currentState:" + controller.currentState)
          view.appendWrongAnimation(...modal.revealedCard)
          setTimeout(this.resetCards, 1000)
        }
        break
    }
    console.log("reveales:" + modal.revealedCard)
    console.log("currentState:" + controller.currentState)
  },
  resetCards() {
    view.flipCards(...modal.revealedCard)
    controller.currentState = GAME_STATE.FirstCardAwaits
    modal.revealedCard = []
  },
  clickCard() {
    document.querySelectorAll(".card").forEach((card) => {
      card.addEventListener("click", (event) => {
        controller.dispatchCardAction(card)
      })
    })
  },
  resetGame() {
    const body = document.querySelector("body")
    body.firstElementChild.remove()
    controller.generateCards()
    controller.currentState = GAME_STATE.FirstCardAwaits
    controller.clickCard()
    modal.score = 0
    modal.tried = 0
    view.renderScore(0)
    view.renderTried(0)
  }
}


controller.generateCards()
controller.clickCard()
// document.querySelectorAll(".card").forEach((card) => {
//   card.addEventListener("click", (event) => {
//     controller.dispatchCardAction(card)
//   })
// })

