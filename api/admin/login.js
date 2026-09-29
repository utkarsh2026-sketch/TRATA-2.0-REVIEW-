module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username, password } = req.body || {};

    if (
      username !== process.env.ADMIN_USERNAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful"
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server error"
    });
  }
};
