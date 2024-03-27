//require('dotenv').config({path: './env})
/*
    use dotenv like es6 module,it requires add an extra flag in the package.json file in the dev script "-r dotenv/config --experimental-json-modules"
*/
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERRR: ", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Mongodb connection failed", error);
  });

/*
;(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    app.on("error", (error) => {
      console.log("ERRR: ", error);
      throw error
    });

    app.listen(process.env.PORT, () => {
      console.log(`server is listing on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();

*/
