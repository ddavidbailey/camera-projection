import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/utils/auth";
import { downloadDriveFile } from "@/lib/google-drive";
import { downloadDropboxFile } from "@/lib/dropbox";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ provider: string; id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { provider, id } = await params;
  const mime = new URL(req.url).searchParams.get("mime") ?? "application/octet-stream";

  try {
    let stream: ReadableStream;
    let contentType: string;

    if (provider === "drive") {
      ({ stream, contentType } = await downloadDriveFile(session.user.id, id, mime));
    } else if (provider === "dropbox") {
      ({ stream, contentType } = await downloadDropboxFile(session.user.id, id));
    } else {
      return NextResponse.json({ error: "Unknown provider" }, { status: 400 });
    }

    return new Response(stream, {
      headers: {
        "Content-Type": contentType || mime,
        "Content-Disposition": "inline",
        "Cache-Control": "private, max-age=300",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
