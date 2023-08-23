"use client";

import { useBoardStore } from "@/store/boardStore";
import React, { useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Column from "./Column";
import Modal from "./Modal";

const Board = () => {
  const [getBoard, board, setBoardState, updateTodoInDb] = useBoardStore(
    (state) => [
      state.getBoard,
      state.board,
      state.setBoardState,
      state.updateTodoInDb
    ]
  );

  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return;

    const isColumnDragged = type === "column";
    if (isColumnDragged) {
      const entries: BoardEntry = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1);
      entries.splice(destination.index, 0, removed);

      const rearrangedColumns = new Map(entries);
      setBoardState({ ...board, columns: rearrangedColumns });
    }

    const columns = board.columns;
    const columKeys = Array.from(columns.keys());
    const startColIndex = columKeys[Number(source.droppableId)] as TypedColumn;
    const finishColIndex = columKeys[
      Number(destination.droppableId)
    ] as TypedColumn;

    if (!startColIndex || !finishColIndex) return;

    const startCol: Column = {
      id: startColIndex,
      todos: columns.get(startColIndex).todos
    };

    const finishCol: Column = {
      id: finishColIndex,
      todos: columns.get(finishColIndex).todos
    };

    if (!startCol || !finishCol) return;

    const newTodos = startCol.todos;
    const [todoMoved] = newTodos.splice(source.index, 1);

    const isSameColumnDragging = startCol.id === finishCol.id;
    if (isSameColumnDragging) {
      newTodos.splice(destination.index, 0, todoMoved);

      const newCol = {
        id: startCol.id,
        todos: newTodos
      };

      const newColumns = new Map(board.columns);
      newColumns.set(startCol.id, newCol);
      setBoardState({ ...board, columns: newColumns });
    } else {
      const finishTodos = Array.from(finishCol.todos);
      finishTodos.splice(destination.index, 0, todoMoved);
      const newColumns = new Map(board.columns);

      const newCol = {
        id: startCol.id,
        todos: newTodos
      };

      const newFinishCol = {
        id: finishCol.id,
        todos: finishTodos
      };

      newColumns.set(startCol.id, newCol);
      newColumns.set(finishCol.id, newFinishCol);

      updateTodoInDb(todoMoved, finishCol.id);
      setBoardState({ ...board, columns: newColumns });
    }
  };

  const columnEntries: BoardEntry = Array.from(board.columns.entries());

  useEffect(() => {
    getBoard();
  }, [getBoard]);
  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {columnEntries.map(([id, column], index) => (
                <Column key={id} id={id} todos={column.todos} index={index} />
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Modal />
    </>
  );
};

export default Board;
