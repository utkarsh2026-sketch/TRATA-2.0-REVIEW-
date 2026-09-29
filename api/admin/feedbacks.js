module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({
      ok: false,
      error: "Method not allowed"
    });
  }

  try {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY;

    if (!url || !key) {
      return res.status(500).json({
        ok: false,
        error: "Supabase environment variables are missing."
      });
    }

    const response = await fetch(
      `${url}/rest/v1/feedbacks?select=id,name,institution,designation,rating,liked,improve,suggestions,signature&order=id.desc`,
      {
        method: "GET",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json"
        }
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error("Supabase feedback fetch error:", text);

      return res.status(500).json({
        ok: false,
        error: text || "Failed to fetch feedbacks."
      });
    }

    let feedbacks;

    try {
      feedbacks = JSON.parse(text);
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error: "Invalid response received from database."
      });
    }

    return res.status(200).json({
      ok: true,
      feedbacks: feedbacks
    });

  } catch (error) {
    console.error("Admin feedbacks API error:", error);

    return res.status(500).json({
      ok: false,
      error: error.message || "Server error"
    });
  }
};
