var sql = require("mssql");

const authController = () => {
  const getLogin = (req, res, next) => { 
    let query = `select [EMPLOYEE_ID] from [DB_DEV].[dbo].[MASTER_EMPLOYEE] (nolock) 
                 where [EMPLOYEE_ID] = '${req.body.xx}'`;
    let request = new sql.Request();
    request.query(query, function (err, result) { 
      if (err) {res.status(400).send(err);}
      else {
        if (result.recordset[0]){
          let query = `select [EMPLOYEE_ID],
                              [ABSENT_ACCESS], 
                              [ABSENT_PASS] = convert(varchar(1000),DECRYPTBYPASSPHRASE ('PTR123',ABSENT_PASS)) 
                      from [DB_DEV].[dbo].[MASTER_EMPLOYEE] (nolock) 
                      where [EMPLOYEE_ID] = '${req.body.xx}'` 
          request.query(query, function(err, result) {
            if (err) {res.status(400).send(err);}
            else {
              if (result.recordset[0].ABSENT_PASS==req.body.yy){
                res.status(200).send({status: 'SUCCESS', data: result.recordset}) 
              }
              else{
                res.status(200).send({status:'Invalid Employee ID and/or Password!'})  
              }
            }
          });
        }
        else{
          res.status(200).send({status:'Invalid Employee ID and/or Password!'})   
        }
      }
    });
  };

  const checkSession = (req, res) => {
    let sql_query = `IF EXISTS(SELECT TOP 1 * 
            FROM [DB_DEV].[dbo].[MASTER_EMPLOYEE]  (NOLOCK) 
            WHERE [EMPLOYEE_ID] = '${req.body.xx}'
            AND convert(varchar(1000),DECRYPTBYPASSPHRASE ('PTR123', ABSENT_PASS)) = '`+req.body.yy+`'
          )
    BEGIN SELECT HASIL = 'SUCCESS', 
                 ABSENT_ACCESS = (SELECT ABSENT_ACCESS
                                  FROM [DB_DEV].[dbo].[MASTER_EMPLOYEE]  (NOLOCK) 
                                  WHERE [EMPLOYEE_ID] = '${req.body.xx}'
                                  AND convert(varchar(1000),DECRYPTBYPASSPHRASE ('PTR123', ABSENT_PASS)) = '`+req.body.yy+`'),
                 EMPLOYEE_NAME = (SELECT EMPLOYEE_NAME
                                  FROM [DB_DEV].[dbo].[MASTER_EMPLOYEE]  (NOLOCK) 
                                  WHERE [EMPLOYEE_ID] = '${req.body.xx}'
                                  AND convert(varchar(1000),DECRYPTBYPASSPHRASE ('PTR123', ABSENT_PASS)) = '`+req.body.yy+`')
    END
    ELSE
    BEGIN SELECT HASIL = 'FAILED' 
    END`;
    var req_sql = new sql.Request();
    req_sql.query(sql_query, function (err, result) {
        if (err) {res.status(400).send(err);}
        else {
            res.status(200).json({
              status: result.recordset[0].HASIL, 
              access_level: result.recordset[0].ABSENT_ACCESS,
              user_name: result.recordset[0].EMPLOYEE_NAME,
            });
        }
    });
  };

  const displayProgramList = (req, res) => {
    let query = `SELECT [PROGRAM_NAME], [PROGRAM_PATH]
      FROM [DB_DEV].[dbo].[MASTER_PROGRAM] A (NOLOCK)
      WHERE [PROGRAM_LEVEL] = '${req.query.xx}'
      AND [PROGRAM_CODE] = 'ABSENT_SYSTEM'
      ORDER BY [PROGRAM_NAME]`;

    var request = new sql.Request();
    request.query(query, function (err, result) {
      if (err) res.status(500).send(err);
      else res.json(result.recordset);
    });
  };

  const changePwd = (req, res) => {
    let sql_query = `UPDATE [DB_DEV].[dbo].[MASTER_EMPLOYEE] 
    SET ABSENT_PASS = EncryptByPassPhrase('PTR123',(cast('`+req.body.yy+`' as varchar(max)))),
        UPDATED_TIME = CURRENT_TIMESTAMP,
        UPDATED_BY = '`+req.body.xx+`'
    WHERE EMPLOYEE_ID='`+req.body.xx+`'`;
    var req_sql = new sql.Request();
    req_sql.query(sql_query, function (err, result) {
        if (err) {res.status(400).send(err);}
        else {
            res.status(200).json({status: "Password successfully changed!", yy: req.body.yy});
        }
    });
  };

  return { 
    getLogin,
    checkSession,
    displayProgramList,
    changePwd,
  };
};

module.exports = authController;