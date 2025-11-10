import { db } from "@/app/lib/db";
import { tables } from "@/app/lib/db/schema/table-schema";

export const onRequestGet: PagesFunction = async () => {
    const result = await db.select().from(tables).all()
    return Response.json(result)
}