import Link from "next/link";

async function getContents() {
    const res = await fetch('http://localhost:3000/api/content', { cache: 'no-store' });

    if (!res.ok) {
        throw new Error('Failed to fetch content ji');
    }

    return res.json();
}

export default async function ContentPage() {
    const contents = await getContents();

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Available Content</h1>

            {contents.length === 0 && <p>No content available.</p>}

            <ul style={{ marginTop: "1rem" }}>
                {contents.map((item: any) => (
                    <li key={item._id} style={{ marginBottom: "1rem" }}>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>

                        <Link href={`/content/${item._id}`}>
                            View Chapters →
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}