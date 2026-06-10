import prisma from "@/lib/prisma";

const VALID_CATEGORIES = ["Exam", "Event", "General"];
const VALID_PRIORITIES = ["Normal", "Urgent"];

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
  if (req.method === "GET") {
    try {
      const notices = await prisma.notice.findMany({
        orderBy: [
          { priority: "desc" },
          { publishDate: "desc" },
          { createdAt: "desc" },
        ],
      });

      return res.status(200).json(notices);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch notices." });
    }
  }

  if (req.method === "POST") {
    const { errors, values } = validateNotice(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const notice = await prisma.notice.create({
        data: values,
      });

      return res.status(201).json(notice);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create notice." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}
