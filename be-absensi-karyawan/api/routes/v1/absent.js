let Route = express.Router();
const controllers = require("../../controllers");
const absentController = controllers.absentController();

Route
  .get( "/", absentController.get_data )
  .post( "/", absentController.insert_data );

module.exports = Route;