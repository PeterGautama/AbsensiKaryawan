let Route = express.Router();
const controllers = require("../../controllers");
const reportController = controllers.reportController();

Route
  .get( "/", reportController.get_data )
  .get( "/attachment", reportController.get_attachment );

module.exports = Route;