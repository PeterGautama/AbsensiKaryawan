var sql = require("mssql");

const reportController = () => {
  const get_data = (req, res, next) => {
    let query = `SELECT A.[EMPLOYEE_ID]
                        ,[EMPLOYEE_NAME] = (SELECT B.EMPLOYEE_NAME 
                                           FROM [DB_DEV].[dbo].[MASTER_EMPLOYEE] B
                                           WHERE B.EMPLOYEE_ID = A.EMPLOYEE_ID)
                        ,A.[ABSENT_DATE]
                        ,A.[ABSENT_CLOCK_IN]
                        ,A.[ABSENT_CLOCK_OUT]
                        ,[ATTACHMENT_FILE_CLOCK_IN] = 'KOSONG'
                        ,A.[ATTACHMENT_NAME_CLOCK_IN]
                        ,[ATTACHMENT_FILE_CLOCK_OUT] = 'KOSONG'
                        ,A.[ATTACHMENT_NAME_CLOCK_OUT]
                        ,A.[UPDATED_TIME]
                        ,A.[UPDATED_BY]
                        ,A.[CREATED_TIME]
                        ,A.[CREATED_BY]
                 FROM [DB_DEV].[dbo].[MASTER_ABSENT] A (NOLOCK)
                 ORDER BY ABSENT_DATE DESC, EMPLOYEE_ID ASC`;
    var request = new sql.Request();
    request.query(query, function (err, result) {
      if (err) res.status(500).send(err);
      else res.json(result.recordset);
    });
  };

  const get_attachment = (req, res, next) => {
    let query = `SELECT ATTACHMENT_FILE_CLOCK_IN, ATTACHMENT_FILE_CLOCK_OUT
                 FROM [DB_DEV].[dbo].[MASTER_ABSENT] (NOLOCK)
                 WHERE CONVERT(VARCHAR(10), [ABSENT_DATE], 121) = '${req.query.aa}'
                 AND [EMPLOYEE_ID] = '${req.query.bb}'`;
    var request = new sql.Request();
    request.query(query, function (err, result) {
      if (err) res.status(500).send(err);
      else res.json(result.recordset[0]);
    });
  };

  return {
    get_data,
    get_attachment, //untuk menghindari loading yang lama, maka attachment dipisah fetchnya
  };
};

module.exports = reportController;
