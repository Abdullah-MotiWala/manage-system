import { OpenAI } from "openai"
const configuration = { apiKey: process.env.OPEN_AI_KEY }

const openai = new OpenAI(configuration)

export default openai