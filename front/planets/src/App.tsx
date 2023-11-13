import { FormEvent, useEffect, useRef, useState } from "react";

type PlanetsProps = {
	name: string;
	url: string;
	id: string;
};

type Lists = {
	listFav: PlanetsProps[];
	listPlanets: PlanetsProps[];
};
type State = {
	name: string;
	url: string;
};

function App() {
	const [lists, setLists] = useState({} as Lists);
	const [favoriteState, setFavoriteState] = useState({} as State);
	const [deleteState, setDeleteState] = useState({} as State);

	const idFav = useRef<string>("");

	async function getPlanetsFav({ name, url }: Partial<State>) {
		const currentUrl =
			name || url
				? `http://localhost:3000/favorites/list?name=${name}&url=${url}`
				: "http://localhost:3000/favorites/list";

		const response = await fetch(currentUrl);
		const planets: Lists["listPlanets"] = await response.json();

		setLists((prev) => ({
			...prev,
			listFav: planets,
		}));
	}

	async function getPlanets() {
		const response = await fetch("http://localhost:3000/list");
		const planets: Lists["listPlanets"] = await response.json();

		setLists((prev) => ({
			...prev,
			listPlanets: planets.map(({ name, url }, index) => ({
				name,
				url,
				id: `${name}${index}`,
			})),
		}));
	}

	function handleFavOrDelete(value: State, type: "fav" | "delete") {
		if (type === "fav") {
			setFavoriteState({
				...value,
			});
			return;
		}

		setDeleteState({
			...value,
		});
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		const form = new FormData(e.currentTarget as HTMLFormElement);

		const name = form.get("name");
		const url = form.get("url");

		const elemente = e.currentTarget.id;

		if (elemente === "favorite") {
			const response = await fetch("http://localhost:3000/save", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name, url }),
			});

			if (response.ok) {
				setFavoriteState({
					name: "",
					url: "",
				});
				getPlanetsFav({});
			}
			return;
		}

		if (elemente === "buscar") {
			getPlanetsFav({ name: name as string, url: url as string });
			return;
		}

		const response = await fetch(
			`http://localhost:3000/delete/${idFav.current}`,
			{
				method: "DELETE",
			},
		);

		if (response.ok) {
			setDeleteState({
				name: "",
				url: "",
			});
			getPlanetsFav({});
		}
	}

	useEffect(() => {
		Promise.all([getPlanetsFav({}), getPlanets()]);
	}, []);

	return (
		<div className="bg-slate-900 w-full flex flex-col p-4 min-h-screen">
			<header className="text-lg text-white justify-center w-full font-bold ">
				<p className="text-center">Lista de planeta</p>
			</header>

			<div className="flex flex-col gap-4 items-center mt-6">
				<form onSubmit={handleSubmit} id="favorite" className="flex gap-4">
					<label
						htmlFor="name"
						className="flex flex-col gap-1 font-bold text-white"
					>
						name
						<input
							value={favoriteState.name}
							className="bg-slate-600 p-1 px-3 rounded-md caret-white placeholder:text-slate-500"
							type="text"
							name="name"
							placeholder="name"
							id="name"
						/>
					</label>
					<label
						htmlFor="url"
						className="flex flex-col gap-1 font-bold text-white"
					>
						url
						<input
							value={favoriteState.url}
							className="bg-slate-600 p-1 px-3 rounded-md caret-white placeholder:text-slate-500"
							type="text"
							name="url"
							placeholder="url"
							id="url"
						/>
					</label>
				</form>
				<button form="favorite" className=" bg-slate-50 rounded-md p-2">
					Favoritar
				</button>
			</div>

			<div className="flex flex-col gap-4 items-center mt-6">
				<form onSubmit={handleSubmit} id="deletar" className="flex gap-4">
					<label
						htmlFor="name"
						className="flex flex-col gap-1 font-bold text-white"
					>
						name
						<input
							value={deleteState.name}
							readOnly
							className="bg-slate-600 p-1 px-3 rounded-md caret-white placeholder:text-slate-500"
							type="text"
							name="name"
							placeholder="name"
							id="name"
						/>
					</label>
					<label
						htmlFor="url"
						className="flex flex-col gap-1 font-bold text-white"
					>
						url
						<input
							value={deleteState.url}
							readOnly
							className="bg-slate-600 p-1 px-3 rounded-md caret-white placeholder:text-slate-500"
							type="text"
							name="url"
							placeholder="url"
							id="url"
						/>
					</label>
				</form>
				<button form="deletar" className=" bg-slate-50 rounded-md p-2">
					deletar
				</button>
			</div>

			<div className="flex flex-col gap-4 items-center mt-6">
				<form onSubmit={handleSubmit} id="buscar" className="flex gap-4">
					<label
						htmlFor="name"
						className="flex flex-col gap-1 font-bold text-white"
					>
						name
						<input
							className="bg-slate-600 p-1 px-3 rounded-md caret-white placeholder:text-slate-500"
							type="text"
							name="name"
							placeholder="name"
							id="name"
						/>
					</label>
					<label
						htmlFor="url"
						className="flex flex-col gap-1 font-bold text-white"
					>
						url
						<input
							className="bg-slate-600 p-1 px-3 rounded-md caret-white placeholder:text-slate-500"
							type="text"
							name="url"
							placeholder="url"
							id="url"
						/>
					</label>
				</form>
				<button form="buscar" className=" bg-slate-50 rounded-md p-2">
					Buscar
				</button>
			</div>

			<table className="bg-slate-600 mt-10 rounded-md">
				<caption className="text-white text-lg mb-2">
					Lista de planetas favoritos
				</caption>
				<thead>
					<tr>
						<th className="text-left">name</th>
						<th className="text-left">url</th>
					</tr>
				</thead>
				<tbody>
					{(lists.listFav || []).map(({ id, name, url }) => (
						<tr
							onClick={() => {
								idFav.current = id;
								handleFavOrDelete({ name, url }, "delete");
							}}
							key={id}
							className="group border-collapse border-spacing-[7px]"
						>
							<td className="text-white group-hover:bg-slate-400 group-hover:rounded-md">
								{name}
							</td>
							<td className="text-white group-hover:bg-slate-400 group-hover:rounded-md">
								{url}
							</td>
						</tr>
					))}
				</tbody>
			</table>

			<table className="bg-slate-600 mt-10 rounded-md">
				<caption className="text-white text-lg mb-2">
					Lista de planetas disponíveis
				</caption>
				<thead>
					<tr>
						<th className="text-left">name</th>
						<th className="text-left">url</th>
					</tr>
				</thead>
				<tbody>
					{(lists.listPlanets || []).map(({ id, name, url }) => (
						<tr
							onClick={() => {
								handleFavOrDelete({ name, url }, "fav");
							}}
							key={id}
							className="group border-collapse border-spacing-[7px]"
						>
							<td className="text-white group-hover:bg-slate-400 group-hover:rounded-md">
								{name}
							</td>
							<td className="text-white group-hover:bg-slate-400 group-hover:rounded-md">
								{url}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default App;
