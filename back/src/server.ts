import express from "express";
import cors from "cors";
import { router as RouterList } from "./routes/list";
import { router as RouterPost } from "./routes/save_favorite";
import { router as RouterListLocal } from "./routes/favorites";
import { router as RouterDelete } from "./routes/delete";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/list", RouterList);
app.use("/save", RouterPost);
app.use("/favorites", RouterListLocal);
app.use("/delete", RouterDelete);

app.listen(3000, () => {
	console.log("server listen port 3000");
});
