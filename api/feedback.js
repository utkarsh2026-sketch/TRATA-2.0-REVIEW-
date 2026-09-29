module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const body = req.body || {};

    const allowed = [
      "name",
      "institution",
      "designation",
      "rating",
      "liked",
      "improve",
      "suggestions",
      "signature"
    ];

    const row = {};

    for (const key of allowed) {
      row[key] = body[key] ?? "";
    }

    row.rating = Number(row.rating);

    if (!row.name) {
      return res.status(400).json({
        ok: false,
        error: "Name is required."
      });
    }

    if (!Number.isInteger(row.rating) || row.rating < 1 || row.rating > 5) {
      return res.status(400).json({
        ok: false,
        error: "Rating must be between 1 and 5."
      });
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;

    if (!url || !key) {
      return res.status(500).json({
        ok: false,
        error: "Supabase environment variables are missing."
      });
    }

    const response = await fetch(`${url}/rest/v1/feedbacks`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(row)
    });

    if (!response.ok) {
      const errorText = await response.text();

      return res.status(500).json({
        ok: false,
        error: errorText || "Database insert failed."
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Feedback submitted successfully."
    });

  } catch (error) {
    console.error("Feedback API error:", error);

    return res.status(500).json({
      ok: false,
      error: error.message || "Server error"
    });
  }
};
