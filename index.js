/*
Add a load memes button
Have it randomly select ten memes
add upvote and down vote arrows
sort order of memes based on votes
*/

const memeArray = []

function getMemes(meme){
    fetch(`https://api.imgflip.com/get_memes`, {
        method: 'GET',
    })
    .then(res => res.json())
    .then(data => renderMemes(data))
}

document.addEventListener("DOMContentLoaded", () => {
    getMemes()
})

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

function renderMemes(images) {
    for(let i=0; i < 10; i++) {
        let memeObj = {
            id: images.data.memes[i].id,
            votes: 0
        }
        let memeCard = document.createElement('div')
        memeCard.className = 'memeItem'
        memeCard.innerHTML = `
            <h2 class="meme-title">${images.data.memes[i].name}</h2>
            <img class="memeImage" src=${images.data.memes[i].url} />
            <div class="vote-group">
            <button id="up-${images.data.memes[i].id}" class="up-btn">Up Vote</button>
            <p><span class="vote-count">${memeObj.votes}</span> votes</p>
            <button id="down-${images.data.memes[i].id}" class="down-btn">Down Vote</button>
            </div>
        `

        document.querySelector('#meme-container').appendChild(memeCard)
        memeCard.querySelector('.up-btn').addEventListener('click', () => {
            memeObj.votes++
            memeCard.querySelector('span').textContent = memeObj.votes
            updateMeme(memeObj)
        })

        memeCard.querySelector('.down-btn').addEventListener('click', () => {
            memeObj.votes--
            memeCard.querySelector('span').textContent = memeObj.votes
            updateMeme(memeObj)
        })


        postMeme(memeObj)
        }
    }