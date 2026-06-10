import Head from "next/head";
import NoticeForm from "@/components/NoticeForm";

export default function AddNoticePage() {
  return (
    <>
      <Head>
        <title>Add Notice | Reno Notice Board</title>
      </Head>

      <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <p className="text-sm font-medium text-zinc-500">Reno Platforms Notice Board</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
              Add Notice
            </h1>
          </div>

          <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <NoticeForm />
          </section>
        </div>
      </main>
    </>
  );
}
