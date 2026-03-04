import axios from "axios";

export default async function handler(req, res) {
  try {
    const { inicio, fim } = req.query;

    // API HTTP da Locaweb (não precisa HTTPS)
    const url = `http://191.252.56.116/api/despesas?inicio=${inicio}&fim=${fim}`;

    const response = await axios.get(url);
    res.status(200).json(response.data);

  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
}