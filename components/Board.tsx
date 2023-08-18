"use client";

import { useBoardStore } from "@/store/boardStore";
import React, { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";

const Board = () => {
  const [getBoard, board, setBoardState] = useBoardStore((state) => [
    state.getBoard,
    state.board,
    state.setBoardState,
  ]);

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    const isColumnDragged = type === "column";
    if (isColumnDragged) {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);

      const rearrangedColumns = new Map(entries);
      setBoardState({ ...board, columns: rearrangedColumns });
    }

    const columns = Array.from(board.columns);
    const startColIndex = columns[Number(source.droppableId)];
    const finishColIndex = columns[Number(destination.droppableId)];

    const startCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1].index,
    };

    const finishCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1].index,
    };

    if (!startCol || !finishCol) return;

    const isSameColumn = source.index === destination.index;
    if (isSameColumn) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    const isSameColumnDragging = startCol.id === finishCol.id;

    if (isSameColumnDragging) {
      newTodos.splice(destination.index, 0, todoMoved);

      const newCol = {
        id: startCol.id,
        todos: newTodos,
      };

      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);

      setBoardState({ ...board, columns: newColumns });
    } else {
      const inDraggedTodos = finishCol.todos;
      inDraggedTodos.splice(destination.index, 0, todoMoved);

      const newCol = {
        id: finishCol.id,
        todos: inDraggedTodos,
      };

      const newColumns = new Map(board.columns);
      newColumns.set(finishCol.id, newCol);
    }
  };

  useEffect(() => {
    getBoard();
  }, [getBoard]);
  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column key={id} id={id} todos={column.todos} index={index} />
            ))}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Board;
