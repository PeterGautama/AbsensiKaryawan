let Route = express.Router();
const controllers = require("../../controllers");
const employeeController = controllers.employeeController();

Route
  .get( "/", employeeController.get_data )
  .post( "/", employeeController.insert_data )
  .put( "/", employeeController.update_data )
  .delete( "/", employeeController.delete_data );

module.exports = Route;