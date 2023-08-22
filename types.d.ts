import { type } from "os";

interface Board {
    columns: Map<>
}

type TypedColumn = "todo" | "inprogress" | "done"

type BoardEntry = [TypedColumn, Column][]

interface Column {
    id: TypedColumn,
    todos: Todo[]
}

interface Todo {
    $id: string,
    $createdAt: string;
    title: string;
    status: TypedColumn
    image?: Image
}

interface Image {
    bucketId: string;
    fileId: string
}
