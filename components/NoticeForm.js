import { useState } from "react";
import { useRouter } from "next/router";

const initialFormData = {
  title: "",
  body: "",
  category: "General",
  priority: "Normal",
  publishDate: "",
};

function formatDateForInput(dateValue) {
  if (!dateValue) {
    return "";
  }

  return new Date(dateValue).toISOString().slice(0, 10);
}

export default function NoticeForm({
  initialValues = initialFormData,
  method = "POST",
  action = "/api/notices",
  submitLabel = "Create Notice",
  submittingLabel = "Saving...",
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    ...initialFormData,
    ...initialValues,
    publishDate: formatDateForInput(initialValues.publishDate),
  });
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
      const response = await fetch(action, {
        method,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError ? (
        <div className="rounded-xl border border-[#E57373]/30 bg-[#E57373]/10 px-4 py-3 text-sm font-medium text-[#9F3D3D]">
          {submitError}
        </div>
      ) : null}

      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-[#4A3F3A]">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-[#E7DCD4] bg-[#FFFDFB] px-4 py-3 text-[#2F2824] shadow-sm outline-none transition placeholder:text-[#A99B93] focus:border-[#C78FA0] focus:ring-4 focus:ring-[#C78FA0]/15"
        />
        {errors.title ? <p className="mt-2 text-sm font-medium text-[#E57373]">{errors.title}</p> : null}
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-semibold text-[#4A3F3A]">
          Body
        </label>
        <textarea
          id="body"
          name="body"
          value={formData.body}
          onChange={handleChange}
          rows={6}
          className="mt-2 w-full resize-y rounded-xl border border-[#E7DCD4] bg-[#FFFDFB] px-4 py-3 text-[#2F2824] shadow-sm outline-none transition placeholder:text-[#A99B93] focus:border-[#C78FA0] focus:ring-4 focus:ring-[#C78FA0]/15"
        />
        {errors.body ? <p className="mt-2 text-sm font-medium text-[#E57373]">{errors.body}</p> : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-[#4A3F3A]">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-[#E7DCD4] bg-[#FFFDFB] px-4 py-3 text-[#2F2824] shadow-sm outline-none transition focus:border-[#C78FA0] focus:ring-4 focus:ring-[#C78FA0]/15"
          >
            <option value="Exam">Exam</option>
            <option value="Event">Event</option>
            <option value="General">General</option>
          </select>
          {errors.category ? (
            <p className="mt-2 text-sm font-medium text-[#E57373]">{errors.category}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-semibold text-[#4A3F3A]">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="mt-2 w-full rounded-xl border border-[#E7DCD4] bg-[#FFFDFB] px-4 py-3 text-[#2F2824] shadow-sm outline-none transition focus:border-[#C78FA0] focus:ring-4 focus:ring-[#C78FA0]/15"
          >
            <option value="Normal">Normal</option>
            <option value="Urgent">Urgent</option>
          </select>
          {errors.priority ? (
            <p className="mt-2 text-sm font-medium text-[#E57373]">{errors.priority}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="publishDate" className="block text-sm font-semibold text-[#4A3F3A]">
          Publish Date
        </label>
        <input
          id="publishDate"
          name="publishDate"
          type="date"
          value={formData.publishDate}
          onChange={handleChange}
          className="mt-2 w-full rounded-xl border border-[#E7DCD4] bg-[#FFFDFB] px-4 py-3 text-[#2F2824] shadow-sm outline-none transition focus:border-[#C78FA0] focus:ring-4 focus:ring-[#C78FA0]/15 sm:max-w-xs"
        />
        {errors.publishDate ? (
          <p className="mt-2 text-sm font-medium text-[#E57373]">{errors.publishDate}</p>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[#EEE4DD] pt-6 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-xl border border-[#D9C9C0] px-5 py-3 text-sm font-semibold text-[#6F625B] transition hover:bg-[#FAF7F2]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-[#C78FA0] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-[#C78FA0]/25 transition hover:bg-[#B77C8E] disabled:cursor-not-allowed disabled:bg-[#D7B5BE]"
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
