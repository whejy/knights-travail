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
    const currentFrom = (x, y) => board[x][y].from;
    const addFrom = (x, y, position) => (board[x][y].from = position);

    const printPath = (array) => {
        console.log(`You made it in ${array.length} moves!`);
        array.forEach((move) => console.log(move));
    };

    const isPositionOnBoard = (x, y) =>
        x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE;

    const isPositionsOnBoard = (array) =>
        array.filter(([x, y]) => isPositionOnBoard(x, y));

    return {
        isPositionOnBoard,
        isPositionsOnBoard,
        isVisited,
        markVisited,
        currentFrom,
        addFrom,
        printPath,
    };
})();

const Queue = (() => {
    const queue = [];
    const enqueue = (item) => queue.push(item);
    const dequeue = () => queue.shift();

    const bfsTraversal = (
        [startX, startY],
        [endX, endY],
        generateNextMoves
    ) => {
        // Generate our queue beginning with the initial position of the piece.
        enqueue([startX, startY]);

        while (queue.length > 0) {
            const [currentX, currentY] = dequeue();

            // If the current position has already been visited, ignore.
            if (Board.isVisited(currentX, currentY)) continue;
            Board.markVisited(currentX, currentY);

            // We have reached our destination, begin constructing the path taken.
            if (currentX === endX && currentY === endY) {
                const path = [[endX, endY]];

                /*
                Each visited position on the board has a record of what position was visited immediately prior to it,
                therefore we can construct the path taken by backtracking through each position and
                keeping track of the 'from' property of each position.
                */
                let [x, y] = Board.currentFrom(endX, endY);
                while (x !== startX || y !== startY) {
                    path.push([x, y]);
                    [x, y] = Board.currentFrom(x, y);
                }
                path.push([startX, startY]);
                path.reverse();
                return Board.printPath(path);
            }

            /*
            We now need to generate the next possible moves using the provided callback.
                (We use a callback so that each piece can provide its own method for generating
                    its valid moves)
            Of those positions, we want to add to the queue only the positions unvisited.
            We also add the current position to the 'from' property of the next position
            so that we can eventually track the path that lead to the end.
            */
            generateNextMoves(currentX, currentY).forEach(([x, y]) => {
                if (!Board.isVisited(x, y)) {
                    Board.addFrom(x, y, [currentX, currentY]);
                    enqueue([x, y]);
                }
            });
        }
    };

    return { bfsTraversal };
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
        // Validate start and end positions. Ensure they are on the board and that start position is different from the end position.
        if (
            (startX === endX && startY === endY) ||
            !Board.isPositionOnBoard(startX, startY) ||
            !Board.isPositionOnBoard(endX, endY)
        )
            throw new Error(
                'Start and End positions must be within the board space and different from one another'
            );

        // Positions are valid. Initiate the queue and begin BFS traversal.
        return Queue.bfsTraversal(
            [startX, startY],
            [endX, endY],
            generateValidMoves
        );
    };

    return { move };
})();

Knight.move([3, 3], [3, 4]);
