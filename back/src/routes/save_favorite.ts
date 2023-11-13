import express from "express";
import { client } from "src/lib/prisma";

export const router = express.Router();

router.post("/", async (req, res) => {
	const { url, name } = req.body;

	const planet = await client.planets.create({
		data: {
			name,
			url,
		},
	});

	res.status(201).send({ planet });
});
