import { ID, storage } from "@/appwrite";

const uploadImage = async (file: File) => {
    if (!file) return;

    const fileUpload = await storage.createFile(process.env.NEXT_PUBLIC_TODOS_BUCKET_ID as string, ID.unique(), file)

    return fileUpload
}
export default uploadImage