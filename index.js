
//Check to see if the ap has already been initiated before
document.addEventListener("DOMContentLoaded", () => {
    getState()
    document.querySelector('#get-memes').addEventListener('click', getMemes)
})

//Calls DB to get the State value
function getState() {
    fetch('http://localhost:3000/dbState', {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => compareState(data.state))
}

//If state is "False", shows a button to call an API, otherwise it gets the memes stored in the DB
function compareState(state) {
    if(state === "false") {
        document.querySelector("#get-memes").style.display = "block";
    } else {
        getMemesFromDb()
    }
}

//Gets an array of Memes from the API and triggers the DB state update
function getMemes() {
    let dbState = {
        "state": "true"
    }
    document.querySelector('#get-memes').style.display = "none";
    fetch(`https://api.imgflip.com/get_memes`, {
        method: 'GET',
    })
    .then(res => res.json())
    .then(obj => renderMemes(obj.data.memes))

    updateState(dbState)
}

//Updates the DB state from "false" to "true"
function updateState(state) {
    fetch('http://localhost:3000/dbstate', {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(state)
    })
    }

//Gets memes stored in the DB
function getMemesFromDb() {
    fetch('http://localhost:3000/memes', {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => renderMemesFromDb(data))
}

//Adds memes to the DB
function postMeme(memeObj) {
    fetch('http://localhost:3000/memes', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
        body: JSON.stringify(memeObj)
    })
}

//Updates the vote count on memes in the DB
function updateMeme(memeObj) {
    fetch(`http://localhost:3000/memes/${memeObj.id}`, {
        method: 'PATCH',
        headers:{
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
              "votes": memeObj.votes
          })
    })
}

//Renders memes to the page from the DB
function renderMemesFromDb(memeArray){
    memeArray.forEach(function(item) {
        let memeCard = document.createElement('div')
        memeCard.className = 'memeItem'
        memeCard.innerHTML = `
            <h2 class="meme-title">${item.name}</h2>
            <img class="memeImage" src=${item.url} />
            <div class="vote-group">
            <button id="up-${item.id}" class="up-btn">Up Vote</button>
            <p><span class="vote-count">${item.votes}</span> votes</p>
            <button id="down-${item.id}" class="down-btn">Down Vote</button>
            </div>
        `

        document.querySelector('#meme-container').appendChild(memeCard)
        memeCard.querySelector('.up-btn').addEventListener('click', () => {
            item.votes++
            memeCard.querySelector('span').textContent = item.votes
            updateMeme(item)
        })

        memeCard.querySelector('.down-btn').addEventListener('click', () => {
            if (item.votes > 0) {
                item.votes--
                memeCard.querySelector('span').textContent = item.votes
                updateMeme(item)
                }
        })
    }
    )}

//Renders memes to the page from the API
function renderMemes(memeArray) {
    for(let i=0; i < 10; i++) {
        let randIndex = Math.floor(Math.random()*memeArray.length)
        let memeObj = {
            id: memeArray[randIndex].id,
            name: memeArray[randIndex].name,
            url: memeArray[randIndex].url,
            votes: 0
        }
        let memeCard = document.createElement('div')
        memeCard.className = 'memeItem'
        memeCard.innerHTML = `
            <h2 class="meme-title">${memeObj.name}</h2>
            <img class="memeImage" src=${memeObj.url} />
            <div class="vote-group">
            <button id="up-${memeObj.id}" class="up-btn">Up Vote</button>
            <p><span class="vote-count">${memeObj.votes}</span> votes</p>
            <button id="down-${memeObj.id}" class="down-btn">Down Vote</button>
            </div>
        `

        document.querySelector('#meme-container').appendChild(memeCard)
        memeCard.querySelector('.up-btn').addEventListener('click', () => {
            memeObj.votes++
            memeCard.querySelector('span').textContent = memeObj.votes
            updateMeme(memeObj)
        })

        memeCard.querySelector('.down-btn').addEventListener('click', () => {
            if (memeObj.votes > 0) {
            memeObj.votes--
            memeCard.querySelector('span').textContent = memeObj.votes
            updateMeme(memeObj)
            }
        })
        postMeme(memeObj)
        }
    }