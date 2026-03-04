import axios from "axios";

export default async function handler(req, res) {
  try {
    const { data } = req.query;

    if (!data) return res.status(400).json({ error: "Data é obrigatória" });

    // URL da API Locaweb
    const url = `http://191.252.56.116/api/tanques?data=${data}`;

    const response = await axios.get(url);

    res.status(200).json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
}