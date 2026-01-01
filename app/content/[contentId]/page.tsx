import Link from "next/link";

async function getChapters(contentId: string) {
    const res = await fetch(
        `http://localhost:3000/api/content/${contentId}/chapters`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch chapters");
    }

    return res.json();
}

export default async function ContentDetailPage(
    { params }: {
        params: Promise<{ contentId: string }>;
    }
) {
    const { contentId } = await params; // ✅ THIS IS THE FIX

    const chapters = await getChapters(contentId);

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Chapters</h1>

            {chapters.length === 0 && (
                <p>No chapters available for this content.</p>
            )}

            <ul style={{ marginTop: "1rem" }}>
                {chapters.map((chapter: any) => (
                    <li key={chapter._id} style={{ marginBottom: "1rem" }}>
                        <h3>{chapter.title}</h3>

                        <Link href={`/content/${contentId}/${chapter._id}`}>
                            Read Chapter →
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
