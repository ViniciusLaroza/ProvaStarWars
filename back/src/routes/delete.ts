import express from "express";
import { client } from "src/lib/prisma";

export const router = express.Router();

router.delete("/:id", async (req, res) => {
	const { id } = req.params;

	const planet = await client.planets.delete({
		where: {
			id,
		},
	});

	res.status(200).send({
		message: `${planet.name} excluído com sucesso`,
	});
});
