let Route = express.Router();
const controllers = require("../../controllers");
const authController = controllers.authController(); 

Route.post("/signin", authController.getLogin)
     .post("/session", authController.checkSession)
     .get("/program", authController.displayProgramList)
     .post("/pwd", authController.changePwd);
    
module.exports = Route;
