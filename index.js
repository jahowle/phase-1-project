/*
Add a load memes button
Have it randomly select ten memes
add upvote and down vote arrows
sort order of memes based on votes
*/

document.addEventListener("DOMContentLoaded", () => {
    getState()
    document.querySelector('#get-memes').addEventListener('click', getMemes)
})

function getState() {
    fetch('http://localhost:3000/dbState', {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => compareState(data.state))
}

function compareState(state) {
    console.log(state)
    if(state === "false") {
        document.querySelector("#get-memes").style.display = "block";
    } else {
        getMemesFromDb()
    }
}


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

function updateState(state) {
    fetch('http://localhost:3000/dbstate', {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(state)
    })
    }


function getMemesFromDb() {
    fetch('http://localhost:3000/memes', {
        method: 'GET'
    })
    .then(res => res.json())
    .then(data => renderMemesFromDb(data))
}

function postMeme(memeObj) {
    fetch('http://localhost:3000/memes', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
        body: JSON.stringify(memeObj)
    })
    .then(res => res.json())
    .then(meme => console.log(meme))
}

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
    .then(res => res.json())
    .then(meme => console.log(meme))
}


function renderMemesFromDb(memeArray){
    for(let i=0; i < 10; i++) {
        let memeObj = {
            id: memeArray[i].id,
            name: memeArray[i].name,
            url: memeArray[i].url,
            votes: memeArray[i].votes
        }
        let memeCard = document.createElement('div')
        memeCard.className = 'memeItem'
        memeCard.innerHTML = `
            <h2 class="meme-title">${memeArray[i].name}</h2>
            <img class="memeImage" src=${memeArray[i].url} />
            <div class="vote-group">
            <button id="up-${memeArray[i].id}" class="up-btn">Up Vote</button>
            <p><span class="vote-count">${memeObj.votes}</span> votes</p>
            <button id="down-${memeArray[i].id}" class="down-btn">Down Vote</button>
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
    }
}


function renderMemes(memeArray) {
    for(let i=0; i < 10; i++) {
        let memeObj = {
            id: memeArray[i].id,
            name: memeArray[i].name,
            url: memeArray[i].url,
            votes: 0
        }
        let memeCard = document.createElement('div')
        memeCard.className = 'memeItem'
        memeCard.innerHTML = `
            <h2 class="meme-title">${memeArray[i].name}</h2>
            <img class="memeImage" src=${memeArray[i].url} />
            <div class="vote-group">
            <button id="up-${memeArray[i].id}" class="up-btn">Up Vote</button>
            <p><span class="vote-count">${memeObj.votes}</span> votes</p>
            <button id="down-${memeArray[i].id}" class="down-btn">Down Vote</button>
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