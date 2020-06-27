const originButton = document.getElementById("origin-btn");
const destButton = document.getElementById("dest-btn");
const startButton = document.getElementById("start-btn");
const obstacleButton = document.getElementById("obstacle-btn");

const column = 80;
const rows = 40;

const canvasWidth = 1200;
const canvasHeight = 600;

let context;
let canvas;
const boxSize = canvasHeight / rows;
let mouseLeftDown = false;

const defaultColor = "#ffffff";
let fillColor = defaultColor;
const originColor = "#63ff4b";
const destColor = "#ff0303";
const visitedColor = "#0e0ef2";
const obstacleColor = "#030303";
const pathColor = "#ff60f2";


// declare 2d array of node
// let nodes = new Array(rows).fill(new Node()).map(() => new Array(column).fill(new Node));
let nodes = [];

for (let i = 0; i < rows; i++) {
    let nodeColumn = [];
    for (let j = 0; j < column; j++) {
        let node = new Node();
        node.rowPos = i;
        node.colPos = j;
        nodeColumn.push(node);
    }
    nodes.push(nodeColumn);
}

let originPos = [];
let destPos = [];
let mode = -1;

const ORIGIN_MODE = 0;
const DESTINATION_MODE = 1;
const OBSTACLE_MODE = 2;
const lineWidth = 1;
let isStartBtn = true;

function ResetAllNode() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < column; j++) {
            ResetNode(i, j);
        }
    }
    ClearPoint();
}

function GetContext() {
    canvas = document.getElementById("editor");
    context = canvas.getContext("2d");
    context.imageSmoothingEnable = false;
    canvas.width = column * boxSize + 1;
    canvas.height = rows * boxSize + 1;
}

function DrawGrid() {

    context.lineWidth = lineWidth;
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.translate(0.5, 0.5);

    for (let i = 0; i <= canvasWidth; i += boxSize) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, canvasHeight);
        context.stroke();
        context.closePath();

        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(canvasWidth, i);
        context.stroke();
        context.closePath();

    }

    context.lineWidth = 0;

}

function mousePositionTo2Dindex(x, y) {
    let row = Math.floor(y / boxSize);
    let col = Math.floor(x / boxSize);
    return {
        row,
        col
    };
}

function DrawColor(row, col, color) {
    context.fillStyle = color;

    context.fillRect((col * boxSize) + (lineWidth / 2),
        (row * boxSize) + (lineWidth / 2),
        boxSize - lineWidth, boxSize - lineWidth);
}

function SetPointPosition(row, col, mode) {

    if (mode == ORIGIN_MODE) {
        if (originPos.length > 0) {
            originPos.pop();
            originPos.pop();
        }

        originPos.push(row);
        originPos.push(col);
    } else if (mode == DESTINATION_MODE) {
        if (destPos.length > 0) {
            destPos.pop();
            destPos.pop();
        }

        destPos.push(row);
        destPos.push(col);
    }

}

function ClearPoint() {
    if (originPos.length > 0) {
        originPos.pop();
        originPos.pop();
    }

    if (destPos.length > 0) {
        destPos.pop();
        destPos.pop();
    }
}

function ResetNode(x, y) {
    nodes[x][y].isOrigin = false;
    nodes[x][y].isDest = false;
    nodes[x][y].isObstacle = false;
    nodes[x][y].isVisited = false;
    nodes[x][y].heuristicValue = 0;
    nodes[x][y].parentNode = null;
    DrawColor(x, y, defaultColor);
}

function SetNodeOrigin(x, y) {
    nodes[x][y].isOrigin = true;
    nodes[x][y].isDest = false;
    nodes[x][y].isObstacle = false;
    nodes[x][y].isVisited = false;
    nodes[x][y].heuristicValue = 0;
    nodes[x][y].parentNode = null;
    DrawColor(x, y, fillColor);

}

function SetNodeDest(x, y) {
    nodes[x][y].isOrigin = false;
    nodes[x][y].isDest = true;
    nodes[x][y].isObstacle = false;
    nodes[x][y].isVisited = false;
    nodes[x][y].heuristicValue = 0;
    nodes[x][y].parentNode = null;
    DrawColor(x, y, fillColor);
}

function SetNodeObstacle(x, y) {
    nodes[x][y].isOrigin = false;
    nodes[x][y].isDest = false;
    nodes[x][y].isObstacle = true;
    nodes[x][y].isVisited = false;
    nodes[x][y].heuristicValue = 0;
    nodes[x][y].parentNode = null;
    DrawColor(x, y, fillColor);
}

function isPositionBound(row, col) {

    if (originPos.length > 0) {
        if (originPos[0] == row && originPos[1] == col) {
            return true;
        }
    }

    if (destPos.length > 0) {
        if (destPos[0] == row && destPos[1] == col) {
            return true;
        }
    }

    return false;
}

function handleDrag(e) {

    if (mouseLeftDown) {

        let x = e.offsetX;
        let y = e.offsetY;

        if (x >= canvasWidth || x <= 0 || y >= canvasHeight || y <= 0) {
            return;
        }

        let {
            row,
            col
        } = mousePositionTo2Dindex(x, y);
        let isBound = isPositionBound(row, col);

        if (mode == ORIGIN_MODE) {

            if (isBound == false) {

                if (originPos.length > 0) {
                    ResetNode(originPos[0], originPos[1]);
                }

                SetPointPosition(row, col, mode);
                SetNodeOrigin(originPos[0], originPos[1])
            }


        } else if (mode == DESTINATION_MODE) {

            if (isBound == false) {
                if (destPos.length > 0) {

                    ResetNode(destPos[0], destPos[1])
                }

                SetPointPosition(row, col, mode);
                SetNodeDest(destPos[0], destPos[1]);

            }
        } else if (mode == OBSTACLE_MODE) {
            if (isBound == false) {
                SetNodeObstacle(row, col);
            }
        }

    }
}

function handleClick(e) {

    let x = e.offsetX;
    let y = e.offsetY;

    if (x >= canvasWidth || x <= 0 || y >= canvasHeight || y <= 0) {
        return;
    }

    let {
        row,
        col
    } = mousePositionTo2Dindex(x, y);
    let isBound = isPositionBound(row, col);

    if (mode == ORIGIN_MODE) {

        if (isBound == false) {

            if (originPos.length > 0) {
                ResetNode(originPos[0], originPos[1]);
            }

            SetPointPosition(row, col, mode);
            SetNodeOrigin(originPos[0], originPos[1])
        }


    } else if (mode == DESTINATION_MODE) {

        if (isBound == false) {
            if (destPos.length > 0) {

                ResetNode(destPos[0], destPos[1])
            }

            SetPointPosition(row, col, mode);
            SetNodeDest(destPos[0], destPos[1]);

        }
    } else if (mode == OBSTACLE_MODE) {
        if (isBound == false) {
            SetNodeObstacle(row, col);
        }
    }

}

function onClickOriginBtn() {
    fillColor = originColor;
    mode = ORIGIN_MODE;
}

function onClickDestBtn() {
    fillColor = destColor;
    mode = DESTINATION_MODE;
}

async function onClickStartBtn() {

    if (isStartBtn && originPos.length > 0 && destPos.length > 0) {
        startButton.style.display = "none";
        await AStar(originPos, destPos, nodes);
        isStartBtn = false;
        startButton.style.display = "block";
        startButton.innerHTML = "Reset";
    } else if (!isStartBtn) {
        ResetAllNode();
        startButton.innerHTML = "Start";
        isStartBtn = true;
    }

}

function onClickObstacleBtn() {
    fillColor = obstacleColor;
    mode = OBSTACLE_MODE;
}

function handleMouseDown(e) {
    mouseLeftDown = true;
}

function handleMouseUp(e) {
    mouseLeftDown = false;
}

function assignListener() {
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleDrag);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', handleClick);
    originButton.addEventListener('click', onClickOriginBtn);
    destButton.addEventListener('click', onClickDestBtn);
    startButton.addEventListener('click', onClickStartBtn);
    obstacleButton.addEventListener('click', onClickObstacleBtn);
}


function init() {
    GetContext();
    assignListener();
    DrawGrid();
}

init();