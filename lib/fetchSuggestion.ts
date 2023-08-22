import { Board } from "@/types";
import formatTodoForAi from "./formatTodoForAi";

const fetchSuggestion = async (board: Board) => {
    const todos = formatTodoForAi(board)
    try {

        const res = await fetch("/api/generateSummary", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ todos })
        })

        const GPTData = await res.json()
        const { content } = GPTData

        return content
    } catch (err) {
        return { error: err }
    }
}

export default fetchSuggestion