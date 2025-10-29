 let players = [
            { id: "P1", name: "player 1", position: 0 },
            { id: "P2", name: "player 2", position: 0 },
            { id: "P3", name: "player 3", position: 0 },
            { id: "P4", name: "player 4", position: 0 }
        ]
      const  colors = ["red","green","blue","aqua"]
        for(let i = 0; i < players.length; i++){
           const player = document.createElement("div");
           player.classList.add("player")
           player.style.backgroundColor = colors[i]
           player.id = players[i].id;
           document.body.appendChild(player);
        }
        let motion = false; 
        let p = 0;
        let specialCells = {
            4: 17,
            14: 27,
            37: 57,
            65: 76
        }
        const dice = document.getElementById('dice');
        const rollBtn = document.getElementById('roll');


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
                  let Q = players[0].position
                    document.getElementById('dice').classList.remove("rollAnimation");
                    let target = Q + p;
                    if (target > 100) { target = target - p }
                    if (target == 100) { document.getElementById('win').style.display = "flex" }
                    let step = Q + 1;
                    const board = document.getElementById('board');
                    const player1 = document.getElementsByClassName('player');
                     player1[0].style.display = "block";
                    const moveInterval = setInterval(() => {
                        if (step > target) {
                            clearInterval(moveInterval);
                            Q = step - 1;
                            if (specialCells[Q]) {
                                const jumpTo = specialCells[Q];
                                setTimeout(
                                    () => {
                                        player1[0].style.display = "block";
                                        board.querySelectorAll(".cell")[jumpTo - 1].appendChild(player1[0]);
                                        player1[0].scrollIntoView({
                                            behavior: "smooth",
                                            block: "center",
                                        })
                                        Q = jumpTo;
                                        players[0].position = Q
                                    }, 300
                                )
                                  }players[0].position = Q
                            return;
                        }
                        board.querySelectorAll(".cell")[step - 1].appendChild(player1[0]);
                        player1[0].scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                            inline: "center"
                        }); step++
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
        Object.keys(specialCells).forEach((i) => {
            document.querySelectorAll('.cell')[i - 1].style.backgroundColor = "green";
        })
        document.getElementById('close').addEventListener(
            'click', () => { document.getElementById('win').style.display = "none" }
        )
