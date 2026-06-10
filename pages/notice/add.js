import Head from "next/head";
import NoticeForm from "@/components/NoticeForm";

export default function AddNoticePage() {
  return (
    <>
      <Head>
        <title>Add Notice | Reno Notice Board</title>
      </Head>

      <main className="min-h-screen bg-[#FAF7F2] px-4 py-10 text-[#2F2824] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#C78FA0]">
              Reno Platforms Notice Board
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-[#2F2824]">
              Add Notice
            </h1>
          </div>

          <section className="rounded-2xl border border-[#EEE4DD] bg-[#FFFDFB] p-6 shadow-[0_14px_40px_rgba(91,71,61,0.08)] sm:p-8">
            <NoticeForm />
          </section>
        </div>
      </main>
    </>
  );
}
