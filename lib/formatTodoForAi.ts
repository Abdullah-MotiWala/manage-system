import { Board, TypedColumn, Todo, Column } from "@/types"; // Replace with your actual import paths

const formatTodoForAi = (board: Board) => {
    const todos: [TypedColumn, Column][] = Array.from(board.columns.entries());

    const flatArray = todos.reduce<{ [key: string]: Todo[] }>((map, [key, value]) => {
        map[key] = value.todos;
        return map;
    }, {});

    const flatArrayCounted = Object.entries(flatArray).reduce((map, [key, value]) => {
        map[key as TypedColumn] = value.length
        return map
    }, {} as { [key in TypedColumn]: number })

    return flatArrayCounted;
};

export default formatTodoForAi;
