let players = [];
function getNum() {
    players = [];
    let n = Number(document.getElementById('numberOfPlayers').value);
    const message = document.getElementById('message');
    if (n < 0) { message.innerText = "Number of players can't be NEGATIVE"; return }
    else if (n > 5) { message.innerText = "Sorry, the game limit is 5 players for now"; return }
    else if (n === 0) { message.innerText = "Then who is going to play?"; return }
    else if (n === 1) { message.innerText = "You alone can't play. Call your friends"; return }
    for (let i = 0; i < n; i++) {
        players.push({ id: `P${i + 1}`, name: `Player ${i + 1}`, position: 0 })
    }
    document.getElementById('start1').style.display = "none";
    const start2 = document.getElementById('start2');
    for (let i = 0; i < n; i++) {
        start2.insertAdjacentHTML('beforeend', `<div><label for="q${i + 1}">Enter Name</label><input type="text" id="q${i + 1}" class="s2" placeholder="Player ${i + 1}"></div>`)
    }
    start2.insertAdjacentHTML('beforeend', `<button onclick="begin()" class="s1">Start</button>`);
    start2.style.display = "flex";
}
function begin() {
    players.forEach((player, i) => {
        if (document.getElementById(`q${i + 1}`).value) { player.name = document.getElementById(`q${i + 1}`).value; }
    })
    document.getElementById('start').style.display = "none";
    document.getElementById('overlay').style.display = "none";
    document.getElementById('name').innerText = `${players[currentTurn].name}'s turn`;
    for (let i = 0; i < players.length; i++) {
        const player = document.createElement("div");
        player.classList.add("player")
        player.style.backgroundColor = colors[i]
        player.id = players[i].id;
        document.getElementById('board').querySelectorAll(".cell")[0].appendChild(player);
    }
}
let winners = [];
let colors = ["#B71C1C", "#1565C0", "#2E7D32", "#4A148C", "#1A237E"];
let motion = false;
let currentTurn = 0;
let p = 0;
let pipe = {
    4: 17,
    14: 27,
    37: 57,
    65: 76,
    88: 93,
}
let bubbles = {
    48: 33,
    78: 63,
    96: 85
}
const dice = document.getElementById('dice');
const rollBtn = document.getElementById('roll');

function nextTurn() {
    if (p != 6) { currentTurn = (currentTurn + 1) % players.length }
    scroll()
    document.querySelectorAll(".player").forEach(i => { i.classList.remove('HL') })
    document.getElementById(players[currentTurn].id).classList.add('HL')
    document.getElementById('name').innerText = `${players[currentTurn].name}'s turn`
    document.getElementById('name').style.backgroundColor = colors[currentTurn];
    document.getElementById('roll').disabled = false;
}
function scroll() {
    const currentPlayer = document.getElementById(players[currentTurn].id);
    currentPlayer.scrollIntoView({
        behavior: "smooth",
        block: "center",
    })
}
function diceRoll() {
    document.getElementById('roll').disabled = true
    p = 1 + Math.floor(Math.random() * 6);

    setTimeout(
        () => { dice.innerText = `${p}` }, 1050
    )
    setTimeout(
        () => { dice.classList.add("rollAnimation") }, 50
    )
}
function movement() {
    let Q = players[currentTurn].position
    document.getElementById('dice').classList.remove("rollAnimation");
    let target = Q + p;
    if (target > 100) { target = target - p }
    let step = Q + 1;
    const board = document.getElementById('board');
    const currentPlayer = document.getElementById(players[currentTurn].id);
    currentPlayer.style.display = "block";
    const moveInterval = setInterval(() => {
        if (step > target) {
            clearInterval(moveInterval);
            Q = step - 1;
            if (pipe[Q] || bubbles[Q]) {
                let jumpTo
                if (pipe[Q]) { jumpTo = pipe[Q]; }
                if (bubbles[Q]) { jumpTo = bubbles[Q]; }
                setTimeout(
                    () => {
                        currentPlayer.style.display = "block";
                        board.querySelectorAll(".cell")[jumpTo - 1].appendChild(currentPlayer);
                        scroll()
                        players[currentTurn].position = jumpTo;
                       setTimeout(nextTurn(), 600);
                    }, 300
                )
            }
            else {
                players[currentTurn].position = Q
                for (let i = players.length - 1; i >= 0; i--) {
                    if (players[i].position == 100) {
                        document.getElementById('overlay').style.display = "block"
                        winners.push(players[currentTurn].name)
                        document.getElementById('winPlayer').innerText = `${players[currentTurn].name}`
                        document.getElementById('win').style.display = "flex";
                        document.getElementById(players[i].id).style.display = "none";
                        players.splice(currentTurn, 1);
                        colors.splice(currentTurn, 1);
                        currentTurn--;
                    }
                }
                nextTurn()
            }
            
            return;
        }
        board.querySelectorAll(".cell")[step - 1].appendChild(currentPlayer);
        scroll(); step++
    }, 300)

}
document.getElementById('dice').addEventListener(
    "animationend", () => { movement() })
document.getElementById('roll').addEventListener(
    'click', diceRoll)

let path = [];
for (let i = 0; i < 100; i++) {
    let cols = 10;
    let col = i % 10;
    let row = Math.floor(i / cols);
    if (row % 2 === 1) { col = cols - 1 - col }
    path.push({ x: col * 10, y: i * 50 })
}
path.forEach(
    (p, i) => {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.style.left = `${p.x}%`;
        if ((i + 1) % 10 === 0) { cell.style.top = `${(i * 50) - 25}px` }
        else if ((i + 1) % 10 === 1) { cell.style.top = `${(i * 50) + 25}px` }
        else { cell.style.top = `${p.y}px`; }
        cell.innerHTML = `<p class = "number">${i + 1}</p>`;
        document.getElementById('board').appendChild(cell);
    })
Object.keys(pipe).forEach((i) => {
    document.querySelectorAll('.cell')[i - 1].style.backgroundColor = "green";
})
Object.keys(bubbles).forEach((i) => {
    document.querySelectorAll('.cell')[i - 1].style.backgroundColor = "orange";
})
document.getElementById('close').addEventListener(
    'click', () => {
         document.getElementById('win').style.display = "none" ;
         document.getElementById('overlay').style.display = "none" ;
         if(players.length == 1){
            winners.push(players[0].name)
                        endScreen()
                    }
    }
)
function endScreen(){
     document.getElementById('overlay').style.display = "block";
     winners.forEach((name, i) => {
        document.getElementById('winList').insertAdjacentHTML('beforeend', `<li class="WL">Place ${i+1}: ${name}</li>`)
     });
     document.getElementById('winList').insertAdjacentHTML('beforeend',`<button id="Home" class="s1" onclick="reload()">Home</button>`);
      document.getElementById('endScreen').style.display = "flex";
}
function reload(){
    location.reload();
}

