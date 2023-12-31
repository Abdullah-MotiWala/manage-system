import { ID, databases, storage } from '@/appwrite'
import { getTodosGroupedByColumn } from '@/lib/getTodosGroupedByColumn'
import uploadImage from '@/lib/uploadImage';
import { create } from 'zustand'

interface BoardState {
    board: Board,
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodoInDb: (todo: Todo, columnId: TypedColumn) => void;

    searchString: string;
    setSearchString: (searchString: string) => void;

    newTask: string;
    setNewTask: (newTask: string) => void;

    newTaskType: TypedColumn;
    setNewTaskType: (newTaskType: TypedColumn) => void;

    image: File | null
    setImage: (image: File | null) => void

    deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void
    addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void

}

export const useBoardStore = create<BoardState>((set, get) => ({
    board: { columns: new Map<TypedColumn, Column>() },
    searchString: "",
    newTask: "",
    newTaskType: "todo",
    image: null,
    setBoardState: (board) => {
        set({ board })
    },
    setSearchString: (searchString) => {
        set({ searchString })
    },
    setNewTask: (newTask) => {
        set({ newTask })
    },
    setNewTaskType: (newTaskType) => {
        set({ newTaskType })
    },
    setImage: (image) => {
        set({ image })
    },

    getBoard: async () => {
        const board: Board = await getTodosGroupedByColumn()
        set({ board })
    },
    updateTodoInDb: async (todo, columnId) => {
        const dbId = process.env.NEXT_PUBLIC_DATABASE_ID!
        const collectionId = process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
        await databases.updateDocument(dbId, collectionId, todo.$id, { title: todo.title, status: columnId })
    },
    deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
        const newColumns = new Map(get().board.columns);
        const column = newColumns.get(id) as { todos: [] };
        if (column) {
            // Check if the column exists before accessing its todos property
            column.todos.splice(taskIndex, 1);

            set({ board: { columns: newColumns } })
        }

        if (todo.image) {
            await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
        }

        await databases.deleteDocument(process.env.NEXT_PUBLIC_DATABASE_ID!, process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!, todo.$id)

    },
    addTask: async (todo, columnId, image) => {
        let file: Image | undefined;

        if (image) {
            const fileUpload = await uploadImage(image)
            if (fileUpload) {
                file = {
                    bucketId: fileUpload.bucketId,
                    fileId: fileUpload.$id
                }
            }
        }

        const { $id } = await databases.createDocument(process.env.NEXT_PUBLIC_DATABASE_ID!, process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!, ID.unique(), {
            title: todo,
            status: columnId,
            ...(file && { image: JSON.stringify(file) })
        })

        set({ newTask: "" })

        set((state) => {
            const newColumns = new Map(state.board.columns)
            const newTodo: Todo = {
                $id,
                $createdAt: new Date().toISOString(),
                title: todo,
                status: columnId,
                ...(file && { image: file })
            }
            const column = newColumns.get(columnId) as Column | undefined;
            if (!column) {
                newColumns.set(columnId, {
                    id: columnId,
                    todos: [newTodo]
                })
            } else {
                column?.todos.push(newTodo)
            }

            return { board: { columns: newColumns } }
        })




    }

}))