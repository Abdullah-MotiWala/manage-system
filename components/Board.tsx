"use client";

import { useBoardStore } from "@/store/boardStore";
import React, { useEffect } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

const Board = () => {
  const [getBoard, board] = useBoardStore((state) => [
    state.getBoard,
    state.board,
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard]);
  return (
    <DragDropContext>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => <div>{Array.from(board.columns.entries()).map}</div>}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
