"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Attempt = {
  _id: string;
  score: number;
  total: number;
  createdAt: string;
  chapter: {
    _id: string;
    title: string;
  };
};

export default function DashboardPage() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttempts() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch("/api/attempts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        router.push("/auth/login");
        return;
      }

      const data = await res.json();
      setAttempts(data);
      setLoading(false);
    }

    loadAttempts();
  }, [router]);

  if (loading) {
    return <p style={{ padding: "2rem" }}>Loading dashboard...</p>;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: 800 }}>
      <h1>Your Dashboard</h1>

      {attempts.length === 0 ? (
        <p>No attempts yet.</p>
      ) : (
        <ul>
          {attempts.map((a) => (
            <li
              key={a._id}
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                border: "1px solid #ccc",
              }}
            >
              <strong>{a.chapter.title}</strong>
              <p>
                Score: {a.score} / {a.total}
              </p>
              <small>
                Attempted on{" "}
                {new Date(a.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
