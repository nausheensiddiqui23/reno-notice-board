import Link from "next/link";

function formatPublishDate(dateValue) {
  if (!dateValue) {
    return "No publish date";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateValue));
}

export default function NoticeCard({ notice, onDelete, isDeleting = false }) {
  const isUrgent = notice.priority === "Urgent";

  return (
    <article className="rounded-2xl border border-[#EEE4DD] bg-[#FFFDFB] p-6 shadow-[0_14px_40px_rgba(91,71,61,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(91,71,61,0.12)]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold leading-7 text-[#2F2824]">{notice.title}</h2>
          <p className="mt-2 text-sm font-medium text-[#8A7B73]">
            Publish Date: {formatPublishDate(notice.publishDate)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-[#E9DCD4] bg-[#FAF7F2] px-3 py-1 text-xs font-semibold text-[#6F625B]">
            {notice.category}
          </span>
          <span
            className={
              isUrgent
                ? "rounded-full bg-[#E57373] px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-[#E57373]/25"
                : "rounded-full bg-[#F3E9E2] px-3 py-1 text-xs font-semibold text-[#7B6E67]"
            }
          >
            {notice.priority}
          </span>
        </div>
      </div>

      <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-[#5E514B]">{notice.body}</p>

      <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-[#F0E6DF] pt-5">
        <Link
          href={`/notice/edit/${notice.id}`}
          className="rounded-xl border border-[#D9C9C0] px-4 py-2 text-sm font-semibold text-[#6F625B] transition hover:bg-[#FAF7F2]"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onDelete(notice)}
          disabled={isDeleting}
          className="rounded-xl border border-[#E57373]/35 px-4 py-2 text-sm font-semibold text-[#C95050] transition hover:bg-[#E57373]/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}
