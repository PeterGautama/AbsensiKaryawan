var sql = require("mssql");

const absentController = () => {
  const get_data = (req, res, next) => {
    let query = `IF EXISTS(
                    SELECT TOP 1 [EMPLOYEE_ID]
                    FROM [DB_DEV].[dbo].[MASTER_ABSENT] (NOLOCK)
                    WHERE [EMPLOYEE_ID] = LTRIM(RTRIM('${
                        req.query.aa && req.query.aa.split("'").join("''")
                    }'))
                    AND CONVERT(VARCHAR(10), [ABSENT_DATE], 121) = CONVERT(VARCHAR(10), CURRENT_TIMESTAMP, 121)
                 )
                 BEGIN
                 SELECT [EMPLOYEE_ID]
                        ,[ABSENT_DATE] = CONVERT(VARCHAR(10), ABSENT_DATE, 121)
                        ,[ABSENT_CLOCK_IN]
                        ,[ABSENT_CLOCK_OUT]
                        ,[ATTACHMENT_FILE_CLOCK_IN] = 'KOSONG'
                        ,[ATTACHMENT_NAME_CLOCK_IN]
                        ,[ATTACHMENT_FILE_CLOCK_OUT] = 'KOSONG'
                        ,[ATTACHMENT_NAME_CLOCK_OUT]
                        ,[ABSENT_STATUS] = CASE WHEN ABSENT_CLOCK_IN IS NULL AND ABSENT_CLOCK_OUT IS NULL THEN 'X1'
                                                WHEN ABSENT_CLOCK_IN IS NOT NULL AND ABSENT_CLOCK_OUT IS NULL THEN 'X2'
                                                ELSE 'X3'
                                           END
                 FROM [DB_DEV].[dbo].[MASTER_ABSENT] (NOLOCK)
                 WHERE [EMPLOYEE_ID] = LTRIM(RTRIM('${
                    req.query.aa && req.query.aa.split("'").join("''")
                  }'))
                  AND CONVERT(VARCHAR(10), [ABSENT_DATE], 121) = CONVERT(VARCHAR(10), CURRENT_TIMESTAMP, 121)
                 END
                 ELSE
                 BEGIN
                 SELECT [EMPLOYEE_ID] = LTRIM(RTRIM('${
                                            req.query.aa && req.query.aa.split("'").join("''")
                                        }'))
                        ,[ABSENT_DATE] = CONVERT(VARCHAR(10), CURRENT_TIMESTAMP, 121)
                        ,[ABSENT_CLOCK_IN] = NULL
                        ,[ABSENT_CLOCK_OUT] = NULL
                        ,[ATTACHMENT_FILE_CLOCK_IN] = 'KOSONG'
                        ,[ATTACHMENT_NAME_CLOCK_IN] = NULL
                        ,[ATTACHMENT_FILE_CLOCK_OUT] = 'KOSONG'
                        ,[ATTACHMENT_NAME_CLOCK_OUT] = NULL
                        ,[ABSENT_STATUS] = 'X1'
                 END`;
    var request = new sql.Request();
    request.query(query, function (err, result) {
      if (err) res.status(500).send(err);
      else res.json(result.recordset[0]);
    });
  };

  const insert_data = (req, res, next) => {
    let query = `
        IF '${req.body.aa}' = 'X1'
        BEGIN
        INSERT INTO [DB_DEV].[dbo].[MASTER_ABSENT]
        ([EMPLOYEE_ID], [ABSENT_DATE], [ABSENT_CLOCK_IN], [ATTACHMENT_FILE_CLOCK_IN], [ATTACHMENT_NAME_CLOCK_IN], [UPDATED_TIME], [UPDATED_BY], [CREATED_TIME], [CREATED_BY])
    	  SELECT
    	    LTRIM(RTRIM('${
                req.body.bb && req.body.bb.split("'").join("''")
              }')) AS EMPLOYEE_ID
          ,CURRENT_TIMESTAMP AS ABSENT_DATE   
          ,LTRIM(RTRIM('${
            req.body.cc && req.body.cc.split("'").join("''")
          }')) AS ABSENT_CLOCK_IN
          ,'${req.body.dd}' AS ATTACHMENT_FILE_CLOCK_IN
          ,LTRIM(RTRIM('${
            req.body.ee && req.body.ee.split("'").join("''")
          }')) AS [ATTACHMENT_NAME_CLOCK_IN]
          ,CURRENT_TIMESTAMP AS UPDATED_TIME
          ,'${req.body.bb}' AS UPDATED_BY
          ,CURRENT_TIMESTAMP AS CREATED_TIME
          ,'${req.body.bb}' AS CREATED_BY

          SELECT 'SUCCESS' AS MESSAGE, 1 AS SUCCESS
        END
        ELSE IF '${req.body.aa}' = 'X2'
        BEGIN
        UPDATE [DB_DEV].[dbo].[MASTER_ABSENT]
    	  SET  
          ABSENT_CLOCK_OUT = LTRIM(RTRIM('${
                                req.body.cc && req.body.cc.split("'").join("''")
                              }'))
          ,ATTACHMENT_FILE_CLOCK_OUT = '${req.body.dd}'
          ,ATTACHMENT_NAME_CLOCK_OUT = LTRIM(RTRIM('${
                                        req.body.ee && req.body.ee.split("'").join("''")
                                       }'))
          ,UPDATED_TIME = CURRENT_TIMESTAMP
          ,UPDATED_BY = '${req.body.bb}'
          WHERE EMPLOYEE_ID = '${req.body.bb}'

          SELECT 'SUCCESS' AS MESSAGE, 1 AS SUCCESS
        END
        ELSE
        BEGIN
        SELECT 'Invalid Error, please contact your IT Staff!' AS MESSAGE, 0 AS SUCCESS
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

  return {
    get_data,
    insert_data,
  };
};

module.exports = absentController;
