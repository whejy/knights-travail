const BOARD_SIZE = 8; // An 8x8 board

const Board = (() => {
    const board = Array.from({ length: BOARD_SIZE }, () =>
        Array.from({ length: BOARD_SIZE }, () => ({
            checked: false,
            from: [],
        }))
    );

    const isVisited = (x, y) => board[x][y].checked;

    const markVisited = (x, y) => (board[x][y].checked = true);

    const currentPath = (x, y) => board[x][y].from;

    const addPath = (x, y, position) => (board[x][y].from = position);

    const isPositionOnBoard = (x, y) =>
        x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;

    const isPositionsOnBoard = (array) =>
        array.filter(([x, y]) => isPositionOnBoard(x, y));

    return { isPositionsOnBoard, isVisited, markVisited, currentPath, addPath };
})();

const Queue = (() => {
    const queue = [];

    const enqueue = (item) => queue.push(item);

    const dequeue = () => queue.shift();

    const getQueue = () => queue;

    const length = () => queue.length;

    return { enqueue, dequeue, length, getQueue };
})();

const Knight = (() => {
    const generateValidMoves = (x, y) => {
        const moves = [
            [x + 1, y + 2],
            [x + 1, y - 2],
            [x - 1, y + 2],
            [x - 1, y - 2],
            [x + 2, y + 1],
            [x + 2, y - 1],
            [x - 2, y + 1],
            [x - 2, y - 1],
        ];
        return Board.isPositionsOnBoard(moves);
    };

    const move = ([startX, startY], [endX, endY]) => {
        Queue.enqueue([startX, startY]);
        while (Queue.length() > 0) {
            const [currentX, currentY] = Queue.dequeue();

            // If the current position has already been visited, ignore
            if (Board.isVisited(currentX, currentY)) continue;
            Board.markVisited(currentX, currentY);

            if (currentX === endX && currentY === endY) {
                const path = [[currentX, currentY]];
                let [x, y] = Board.currentPath(endX, endY);
                while (x !== startX || y !== startY) {
                    path.push([x, y]);
                    [x, y] = Board.currentPath(x, y);
                }
                path.push([startX, startY]);
                path.reverse();
                console.log('FINISHED', path);
                return;
            }

            generateValidMoves(currentX, currentY).forEach(([x, y]) => {
                if (!Board.isVisited(x, y)) {
                    Board.addPath(x, y, [currentX, currentY]);
                    Queue.enqueue([x, y]);
                }
            });
        }
    };

    return { move };
})();

Knight.move([0, 0], [2, 1]);
