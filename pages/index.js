import Head from "next/head";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import NoticeCard from "@/components/NoticeCard";

function sortNotices(notices) {
  return [...notices].sort((firstNotice, secondNotice) => {
    if (firstNotice.priority !== secondNotice.priority) {
      return firstNotice.priority === "Urgent" ? -1 : 1;
    }

    return new Date(secondNotice.publishDate) - new Date(firstNotice.publishDate);
  });
}

async function requestNotices() {
  const response = await fetch("/api/notices");
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to load notices.");
  }

  return data;
}

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingNoticeId, setDeletingNoticeId] = useState(null);

  async function refreshNotices() {
    try {
      const data = await requestNotices();
      setNotices(data);
    } catch (refreshError) {
      setError(refreshError.message);
    }
  }

  useEffect(() => {
    async function loadNotices() {
      try {
        const data = await requestNotices();
        setNotices(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadNotices();
  }, []);

  async function handleDeleteNotice(notice) {
    const shouldDelete = window.confirm(`Delete "${notice.title}"?`);

    if (!shouldDelete) {
      return;
    }

    setDeletingNoticeId(notice.id);
    setError("");

    try {
      const response = await fetch(`/api/notices/${notice.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to delete notice.");
        return;
      }

      await refreshNotices();
    } catch (deleteError) {
      setError("Failed to delete notice.");
    } finally {
      setDeletingNoticeId(null);
    }
  }

  const sortedNotices = useMemo(() => sortNotices(notices), [notices]);

  return (
    <>
      <Head>
        <title>Reno Notice Board</title>
      </Head>

      <main className="min-h-screen bg-[#FAF7F2] px-4 py-10 text-[#2F2824] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C78FA0]">
                Reno Platforms
              </p>
              <h1 className="mt-3 text-4xl font-semibold text-[#2F2824] sm:text-5xl">
                Notice Board
              </h1>
            </div>

            <Link
              href="/notice/add"
              className="inline-flex items-center justify-center rounded-xl bg-[#C78FA0] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C78FA0]/25 transition hover:-translate-y-0.5 hover:bg-[#B77C8E]"
            >
              Add Notice
            </Link>
          </header>

          {isLoading ? (
            <div className="rounded-2xl border border-[#EEE4DD] bg-[#FFFDFB] p-8 text-center text-[#6F625B] shadow-[0_14px_40px_rgba(91,71,61,0.08)]">
              Loading notices...
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="rounded-2xl border border-[#E57373]/30 bg-[#E57373]/10 p-8 text-center font-medium text-[#9F3D3D]">
              {error}
            </div>
          ) : null}

          {!isLoading && !error && sortedNotices.length === 0 ? (
            <section className="rounded-2xl border border-dashed border-[#D9C9C0] bg-[#FFFDFB] p-10 text-center shadow-[0_14px_40px_rgba(91,71,61,0.08)]">
              <h2 className="text-xl font-semibold text-[#2F2824]">No notices yet</h2>
              <p className="mt-3 text-sm leading-6 text-[#7B6E67]">
                Create the first notice to start building the board.
              </p>
              <Link
                href="/notice/add"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#C78FA0] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#C78FA0]/25 transition hover:-translate-y-0.5 hover:bg-[#B77C8E]"
              >
                Add Notice
              </Link>
            </section>
          ) : null}

          {!isLoading && !error && sortedNotices.length > 0 ? (
            <section className="grid gap-5">
              {sortedNotices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onDelete={handleDeleteNotice}
                  isDeleting={deletingNoticeId === notice.id}
                />
              ))}
            </section>
          ) : null}
        </div>
      </main>
    </>
  );
}
