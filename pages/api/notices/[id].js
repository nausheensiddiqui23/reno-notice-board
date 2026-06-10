import prisma from "@/lib/prisma";

const VALID_CATEGORIES = ["Exam", "Event", "General"];
const VALID_PRIORITIES = ["Normal", "Urgent"];

function getNoticeId(id) {
  const noticeId = Number(id);

  if (!Number.isInteger(noticeId) || noticeId < 1) {
    return null;
  }

  return noticeId;
}

function validateNotice(data) {
  const errors = {};
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const body = typeof data.body === "string" ? data.body.trim() : "";
  const publishDate = new Date(data.publishDate);

  if (!title) {
    errors.title = "Title is required.";
  }

  if (!body) {
    errors.body = "Body is required.";
  }

  if (!VALID_CATEGORIES.includes(data.category)) {
    errors.category = "Category must be Exam, Event, or General.";
  }

  if (!VALID_PRIORITIES.includes(data.priority)) {
    errors.priority = "Priority must be Normal or Urgent.";
  }

  if (!data.publishDate || Number.isNaN(publishDate.getTime())) {
    errors.publishDate = "Publish date must be valid.";
  }

  return {
    errors,
    values: {
      title,
      body,
      category: data.category,
      priority: data.priority,
      publishDate,
    },
  };
}

export default async function handler(req, res) {
  const noticeId = getNoticeId(req.query.id);

  if (!noticeId) {
    return res.status(400).json({ error: "Notice id must be a positive integer." });
  }

  if (req.method === "PUT") {
    const { errors, values } = validateNotice(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const existingNotice = await prisma.notice.findUnique({
        where: { id: noticeId },
      });

      if (!existingNotice) {
        return res.status(404).json({ error: "Notice not found." });
      }

      const notice = await prisma.notice.update({
        where: { id: noticeId },
        data: values,
      });

      return res.status(200).json(notice);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update notice." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const existingNotice = await prisma.notice.findUnique({
        where: { id: noticeId },
      });

      if (!existingNotice) {
        return res.status(404).json({ error: "Notice not found." });
      }

      await prisma.notice.delete({
        where: { id: noticeId },
      });

      return res.status(200).json({ message: "Notice deleted successfully." });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete notice." });
    }
  }

  res.setHeader("Allow", ["PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}
