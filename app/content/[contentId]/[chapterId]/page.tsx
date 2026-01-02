"use client";

import { useEffect, useState } from "react";

type Chapter = {
    _id: string;
    title: string;
    body: string;
};

type MCQ = {
    _id: string;
    question: string;
    options: string[];
};

export default function ChapterReader({
    params,
}: {
    params: Promise<{ contentId: string; chapterId: string }>;
}) {
    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [mcqs, setMcqs] = useState<MCQ[]>([]);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [result, setResult] = useState<null | {
        score: number;
        total: number;
        results: {
            mcqId: string;
            correct: boolean;
            correctIndex: number;
        }[];
    }>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            const { contentId, chapterId } = await params;

            // 1. fetch chapters for content
            const chaptersRes = await fetch(`/api/content/${contentId}/chapters`);
            const chapters = await chaptersRes.json();

            const found = chapters.find((c: any) => c._id === chapterId);
            setChapter(found);

            // 2. fetch MCQs
            const mcqRes = await fetch(`/api/chapters/${chapterId}/mcqs`);
            const mcqData = await mcqRes.json();
            setMcqs(mcqData);

            setLoading(false);
        }

        load();
    }, [params]);

    async function submitAnswers() {
        const { chapterId } = await params;

        const token = localStorage.getItem('token');

        if (!token) {
            alert('You are NOT logged in !');
            return
        }

        const payload = {
            answers: Object.entries(answers).map(([mcqId, selectedIndex]) => ({
                mcqId,
                selectedIndex,
            })),
        };

        const res = await fetch(`/api/chapters/${chapterId}/submit`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.error || "Submission failed");
            return;
        }

        setResult(data);
    }

    if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

    if (!chapter) return <p>Chapter not found</p>;

    return (
        <div style={{ padding: "2rem", maxWidth: 800 }}>
            <h1>{chapter.title}</h1>
            <p>{chapter.body}</p>

            <hr />

            <h2>Questions</h2>

            {mcqs.map((mcq, idx) => (
                <div key={mcq._id} style={{ marginBottom: "1.5rem" }}>
                    <p>
                        <strong>
                            {idx + 1}. {mcq.question}
                        </strong>
                    </p>

                    {mcq.options.map((opt, i) => (
                        <label key={i} style={{ display: "block" }}>
                            <input
                                type="radio"
                                name={mcq._id}
                                checked={answers[mcq._id] === i}
                                onChange={() =>
                                    setAnswers((prev) => ({
                                        ...prev,
                                        [mcq._id]: i,
                                    }))
                                }
                            />
                            {" "}{opt}
                        </label>
                    ))}
                </div>
            ))}

            <button onClick={submitAnswers}>Submit Answers</button>

            {result && Array.isArray(result.results) && (
                <div style={{ marginTop: "2rem" }}>
                    <h3>
                        Score: {result.score} / {result.total}
                    </h3>

                    <ul>
                        {result.results.map((r) => (
                            <li key={r.mcqId}>
                                {r.correct ? "✅ Correct" : "❌ Wrong"} (Correct option:{" "}
                                {r.correctIndex + 1})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
}
