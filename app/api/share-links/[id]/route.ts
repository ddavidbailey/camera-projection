import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { getPool } from "@/database/db";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const db = getPool();

  try {
    const result = await db.query(
      `DELETE FROM "share_links"
       WHERE "id" = $1 AND "userId" = $2`,
      [id, session.user.id],
    );

    if ((result.rowCount ?? 0) === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[share-links DELETE]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
