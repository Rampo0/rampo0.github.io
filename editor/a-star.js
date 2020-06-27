const row = 0;
const col = 1;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function Pythagoras(point1, point2) {
    const dx = point1[col] - point2[col];
    const dy = point1[row] - point2[row];
    const dx2 = dx * dx;
    const dy2 = dy * dy;
    return Math.sqrt(dx2 + dy2);
}

function DrawPath(node){
    parentNode = node.parentNode;
    parent_parentNode = parentNode.parentNode;
    
    if(parent_parentNode == null){ return; }

    DrawColor(parentNode.rowPos , parentNode.colPos , pathColor);
    DrawPath(parentNode);
}

async function AStar(originPos, destPos, nodes) {
    let priorityQueue = new PriorityQueue();

    let currentNode = nodes[originPos[row]][originPos[col]];
    nodes[currentNode.rowPos][currentNode.colPos].isVisited = true;
    
    let moves = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1]
    ];
    let stop = false;

    while (true) {
        moves.forEach(move => {
            const possibleMove = [currentNode.rowPos + move[row], currentNode.colPos + move[col]];

            if (possibleMove[row] <= nodes.length - 1 && possibleMove[row] >= 0 && possibleMove[col] <= nodes[row].length - 1 && possibleMove[col] >= 0) {
                let possibleNode = nodes[possibleMove[row]][possibleMove[col]];
                possibleNode.heuristicValue = Pythagoras([possibleNode.rowPos, possibleNode.colPos], destPos);
                
                if (possibleNode.isObstacle == false && possibleNode.isVisited == false) {
                    possibleNode.parentNode = currentNode;
                    priorityQueue.insert(possibleNode);
                    
                    let drawAble = true
                    if(possibleNode.rowPos == originPos[row] && possibleNode.colPos == originPos[col]){
                        drawAble = false;
                    }

                    if(possibleNode.rowPos == destPos[row] && possibleNode.colPos == destPos[col]){
                        drawAble = false;
                    }

                    if(drawAble){
                        DrawColor(possibleNode.rowPos, possibleNode.colPos, visitedColor);
                        nodes[possibleNode.rowPos][possibleNode.colPos].isVisited = true;
                    }

                }

            }

        });

        currentNode = priorityQueue.pop();
        
        await sleep(0);
            
        if(currentNode == null){
            break;     
        }
        
        if(currentNode.rowPos == destPos[row] && currentNode.colPos == destPos[col]){
            stop = true;
            DrawPath(currentNode);
        }

        if(stop){
            break;
        }
        
    }
}
