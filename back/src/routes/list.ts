import express from "express";

export const router = express.Router();

type Response = {
	results: [
		{
			planets: string[];
		},
	];
};

type PlanetsProps = {
	name: string;
	url: string;
};

router.get("/", async (req, res) => {
	const result = await fetch("https://swapi.dev/api/films/?format=json");
	const jsons: Response = await result.json();
	const list = jsons.results.flatMap(({ planets }) => planets);
	const planets: PlanetsProps[] = [];

	// eslint-disable-next-line no-restricted-syntax
	for await (const json of list) {
		const response = await fetch(json);
		const planet: PlanetsProps = await response.json();

		planets.push({
			name: planet.name,
			url: planet.url,
		});
	}

	return res.send(planets);
});
