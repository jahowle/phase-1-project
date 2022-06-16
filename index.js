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

function renderMemes(images) {
    for(let i=0; i < 10; i++) {
        let memeCard = document.createElement('div')
        memeCard.className = 'meme'
        memeCard.innerHTML = `<img src=${images.data.memes[i].url} />`
        document.querySelector('#memes').appendChild(memeCard)
        }
    }