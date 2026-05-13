import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 
const app = express();
app.use(cors());
 
// Serve everything in /public at the root path so
// URLs like /name.glb, /steelheads.glb etc. all work.
// Put your .glb files in a "public" folder next to server.js
app.use("/", express.static(path.join(__dirname, "public")));
 
// Keep /models route too for backward-compat
app.use("/models", express.static(path.join(__dirname, "public")));
 
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
 