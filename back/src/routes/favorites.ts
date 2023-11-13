import express from "express";
import { client } from "src/lib/prisma";

export const router = express.Router();

router.get("/list", async (req, res) => {
	const { query } = req;

	const list = await client.planets.findMany({
		where: {
			name: {
				contains: query.name as string,
			},
			url: {
				contains: query.url as string,
			},
		},
	});

	return res.send(list);
});
