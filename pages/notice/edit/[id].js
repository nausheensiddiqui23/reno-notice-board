import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NoticeForm from "@/components/NoticeForm";

export default function EditNoticePage() {
  const router = useRouter();
  const { id } = router.query;
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    async function fetchNotice() {
      try {
        const response = await fetch(`/api/notices/${id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to load notice.");
          return;
        }

        setNotice(data);
      } catch (fetchError) {
        setError("Failed to load notice.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotice();
  }, [id, router.isReady]);

  return (
    <>
      <Head>
        <title>Edit Notice | Reno Notice Board</title>
      </Head>

      <main className="min-h-screen bg-[#FAF7F2] px-4 py-10 text-[#2F2824] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C78FA0]">
              Reno Platforms Notice Board
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#2F2824]">
              Edit Notice
            </h1>
          </div>

          <section className="rounded-2xl border border-[#EEE4DD] bg-[#FFFDFB] p-6 shadow-[0_14px_40px_rgba(91,71,61,0.08)] sm:p-8">
            {isLoading ? <p className="text-sm font-medium text-[#6F625B]">Loading notice...</p> : null}

            {!isLoading && error ? (
              <div className="rounded-xl border border-[#E57373]/30 bg-[#E57373]/10 px-4 py-3 text-sm font-medium text-[#9F3D3D]">
                {error}
              </div>
            ) : null}

            {!isLoading && notice ? (
              <NoticeForm
                initialValues={notice}
                method="PUT"
                action={`/api/notices/${id}`}
                submitLabel="Update Notice"
                submittingLabel="Updating..."
              />
            ) : null}
          </section>
        </div>
      </main>
    </>
  );
}
