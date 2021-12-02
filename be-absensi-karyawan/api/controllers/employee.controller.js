var sql = require("mssql");

const employeeController = () => {
  const get_data = (req, res, next) => {
    let query = `SELECT *
                 FROM [DB_DEV].[dbo].[MASTER_EMPLOYEE] A (NOLOCK)
                 WHERE [ABSENT_ACCESS] <> 'Admin'
                 ORDER BY [EMPLOYEE_NAME] DESC`;
    var request = new sql.Request();
    request.query(query, function (err, result) {
      if (err) res.status(500).send(err);
      else res.json(result.recordset);
    });
  };

  const insert_data = (req, res, next) => {
    let query = `
        IF EXISTS(
            SELECT * FROM [DB_DEV].[dbo].[MASTER_EMPLOYEE]
            WHERE [EMPLOYEE_ID] = LTRIM(RTRIM('${
            req.body.aa &&
            req.body.aa.split("'").join("''")
            }')) 
        )
        BEGIN
        SELECT 'This Employee ID is already registered!' AS MESSAGE, 0 AS SUCCESS
        END
        ELSE
        BEGIN
        INSERT INTO [DB_DEV].[dbo].[MASTER_EMPLOYEE]
        ([EMPLOYEE_ID], [EMPLOYEE_NAME], [DEPT], [HIERARCHY], [ABSENT_ACCESS], [ABSENT_PASS], [UPDATED_TIME], [UPDATED_BY], [CREATED_TIME], [CREATED_BY])
    	  SELECT
    	    LTRIM(RTRIM('${
                req.body.aa && req.body.aa.split("'").join("''")
              }')) AS EMPLOYEE_ID
          ,LTRIM(RTRIM('${
            req.body.bb && req.body.bb.split("'").join("''")
          }')) AS EMPLOYEE_NAME
          ,LTRIM(RTRIM('${
            req.body.cc && req.body.cc.split("'").join("''")
          }')) AS [DEPT]
          ,LTRIM(RTRIM('${
            req.body.dd && req.body.dd.split("'").join("''")
          }')) AS [HIERARCHY]
          ,'Staff' AS ABSENT_ACCESS
          ,EncryptByPassPhrase('PTR123',cast('`+req.body.dd+`' as varchar(max))) as ABSENT_PASS
          ,CURRENT_TIMESTAMP AS UPDATED_TIME
          ,'${req.body.ee}' AS UPDATED_BY
          ,CURRENT_TIMESTAMP AS CREATED_TIME
          ,'${req.body.ee}' AS CREATED_BY

        SELECT 'SUCCESS' AS MESSAGE, 1 AS SUCCESS
        END
      `;

    query = query.split("'undefined'").join("NULL");
    query = query.split("'null'").join("NULL");

    var request = new sql.Request();
    request.query(query, function (err, result) {
      if (err) res.status(500).send(err);
      else res.json(result.recordset[0]);
    });
  };

  const update_data = (req, res, next) => {
    let query = `
        UPDATE [DB_DEV].[dbo].[MASTER_EMPLOYEE]
        SET [EMPLOYEE_NAME] = LTRIM(RTRIM('${
                                req.body.aa && req.body.aa.split("'").join("''")
                              }')),
            [DEPT] = LTRIM(RTRIM('${
                      req.body.bb && req.body.bb.split("'").join("''")
                     }')),
            [HIERARCHY] = LTRIM(RTRIM('${
                            req.body.cc && req.body.cc.split("'").join("''")
                          }')),
            [UPDATED_TIME] = CURRENT_TIMESTAMP,
            [UPDATED_BY] = '${req.body.dd}'
        WHERE [EMPLOYEE_ID] = '${req.body.ee}'

        SELECT 'SUCCESS' AS MESSAGE, 1 AS SUCCESS
      `;

    query = query.split("'undefined'").join("NULL");
    query = query.split("'null'").join("NULL");

    var request = new sql.Request();
    request.query(query, function (err, result) {
      if (err) res.status(500).send(err);
      else res.json(result.recordset[0]);
    });
  };

  const delete_data = (req, res, next) => {
    let query = `
        DELETE FROM [DB_DEV].[dbo].[MASTER_EMPLOYEE]
        WHERE [EMPLOYEE_ID] = '${req.body.aa}'

        SELECT 'SUCCESS' AS MESSAGE, 1 AS SUCCESS
      `;

    query = query.split("'undefined'").join("NULL");
    query = query.split("'null'").join("NULL");

    var request = new sql.Request();
    request.query(query, function (err, result) {
      if (err) res.status(500).send(err);
      else res.json(result.recordset[0]);
    });
  };

  return {
    get_data,
    insert_data,
    update_data,
    delete_data,
  };
};

module.exports = employeeController;
