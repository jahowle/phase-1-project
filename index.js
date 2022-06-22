/*
Add a load memes button
Have it randomly select ten memes
add upvote and down vote arrows
sort order of memes based on votes
*/

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

function renderMemes(images) {
    for(let i=0; i < 10; i++) {
        let memeObj = {
            id: images.data.memes[i].id,
            votes: 0
        }
        let memeCard = document.createElement('div')
        memeCard.className = 'memeItem'
        memeCard.innerHTML = `
        <h2>${images.data.memes[i].name}</h2>
        <img class="memeImage" src=${images.data.memes[i].url} />
        <button>Up Vote</button>
        <p>${memeObj.votes} votes</p>
        <button>Down Vote</button>
        `
        document.querySelector('#memes').appendChild(memeCard)
        postMeme(memeObj)
        }
    }