import { useState } from "react";
import { useRouter } from "next/router";

const initialFormData = {
  title: "",
  body: "",
  category: "General",
  priority: "Normal",
  publishDate: "",
};

export default function NoticeForm() {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors || {});
        setSubmitError(data.error || "");
        return;
      }

      router.push("/");
    } catch (error) {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {submitError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </div>
      ) : null}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-zinc-800">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
        />
        {errors.title ? <p className="mt-1 text-sm text-red-600">{errors.title}</p> : null}
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-zinc-800">
          Body
        </label>
        <textarea
          id="body"
          name="body"
          value={formData.body}
          onChange={handleChange}
          rows={6}
          className="mt-2 w-full resize-y rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
        />
        {errors.body ? <p className="mt-1 text-sm text-red-600">{errors.body}</p> : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-zinc-800">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
          >
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
            <option value="General">General</option>
          </select>
          {errors.category ? <p className="mt-1 text-sm text-red-600">{errors.category}</p> : null}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-zinc-800">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200"
          >
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
          </select>
          {errors.priority ? <p className="mt-1 text-sm text-red-600">{errors.priority}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="publishDate" className="block text-sm font-medium text-zinc-800">
          Publish Date
        </label>
        <input
          id="publishDate"
          name="publishDate"
          type="date"
          value={formData.publishDate}
          onChange={handleChange}
          className="mt-2 w-full rounded-md border border-zinc-300 px-3 py-2 text-zinc-950 outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-200 sm:max-w-xs"
        />
        {errors.publishDate ? (
          <p className="mt-1 text-sm text-red-600">{errors.publishDate}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-zinc-200 pt-5">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isSubmitting ? "Saving..." : "Create Notice"}
        </button>
      </div>
    </form>
  );
}
