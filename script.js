 let players = [
            { id: "P1", name: "player 1", position: 0 },
            { id: "P2", name: "player 2", position: 0 },
            { id: "P3", name: "player 3", position: 0 },
            { id: "P4", name: "player 4", position: 0 }
        ]
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
         document.getElementById('name').innerText = `${players[currentTurn].name}'s turn`
        function nextTurn(){
              if(p != 6) {currentTurn = (currentTurn+1)%players.length}
              scroll()
               document.querySelectorAll(".player").forEach(i => {i.classList.remove('HL')})
               document.getElementById(players[currentTurn].id).classList.add('HL')
               document.getElementById('name').innerText = `${players[currentTurn].name}'s turn`
        }
        function scroll() {
             const currentPlayer = document.getElementById(players[currentTurn].id);
              currentPlayer.scrollIntoView({
                                            behavior: "smooth",
                                            block: "center",
                                        })
        }
        function diceRoll() {
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
                              if(pipe[Q]) {jumpTo = pipe[Q];}
                              if(bubbles[Q]) {jumpTo =bubbles[Q];}
                                setTimeout(
                                    () => {
                                        currentPlayer.style.display = "block";
                                        board.querySelectorAll(".cell")[jumpTo - 1].appendChild(currentPlayer);
                                       scroll()
                                        players[currentTurn].position = jumpTo;
                                        nextTurn()
                                    }, 300
                                )
                                  }
                               else {players[currentTurn].position = Q
                                 for(let i = players.length - 1;i >= 0; i--){
            if (players[i].position == 100) { document.getElementById('win').style.display = "flex"
                        document.getElementById(players[i].id).style.display = "none";
                        players.splice(currentTurn, 1);}}
                                nextTurn()}
                            return;
                        }
                        board.querySelectorAll(".cell")[step - 1].appendChild(currentPlayer);
                        scroll(); step++
                    }, 300)
                   
                }
                 document.getElementById('dice').addEventListener(
                "animationend",() => {movement()})
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
                cell.textContent = i + 1;
                document.getElementById('board').appendChild(cell);
            })
            const colors = ["#B71C1C", "#1565C0", "#2E7D32", "#4A148C"];
        for(let i = 0; i < players.length; i++){
           const player = document.createElement("div");
           player.classList.add("player")
           player.style.backgroundColor = colors[i]
           player.id = players[i].id;
           document.getElementById('board').querySelectorAll(".cell")[0].appendChild(player);
        }
        Object.keys(pipe).forEach((i) => {
            document.querySelectorAll('.cell')[i - 1].style.backgroundColor = "green";
        })
        Object.keys(bubbles).forEach((i) => {
            document.querySelectorAll('.cell')[i - 1].style.backgroundColor = "orange";
        })
        document.getElementById('close').addEventListener(
            'click', () => { document.getElementById('win').style.display = "none" }
        )
        
