let oracledb = require('oracledb');
let dbConfig = require('./dbConfig');

//Express 기본 모듈
let express = require('express');
let http = require('http');
express.path = require('path');

// 익스프레스 객체 생성
let app = express();

// 기본 속성
app.set('port', process.env.PORT || 8001);

// body-parser
let bodyParser = require('body-parser');
const { response } = require('express');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

let router = express.Router();

oracledb.autoCommit = true;

router.post('/dbTestSelect', function(req, res) {
    oracledb.getConnection(
        {
            user : dbConfig.user,
            password : dbConfig.password,
            connectString : dbConfig.connectString
        },
        function(err, connection) {
            if(err) {
                console.error(err.message);
                return;
            } else {
                console.log("connected!");
            }

            let query = 'select * from h_user';

            connection.execute(query, [], function(err, result) {
                if(err) {
                    console.log(err.message);
                    doRelease(connection);
                    return;
                }
                console.log(result.rows);
                doRelease(connection, result.rows);
            });
        }
    );

    // DB 연결 해제
    function doRelease(connection, rowList) {
        connection.release(function(err) {
            if(err) {
                console.error(err.message);
            }

            // DB종료까지 모두 완료되었을때 응답 데이터 반환
            console.log('list size: ' + rowList.length);
            
            response.send(rowList);


        });
    }
});

// 데이터 입력 처리
router.post('/dbTestInsert', function(req, res) {
    oracledb.getConnection(
        {
            user : dbConfig.user,
            password : dbConfig.password,
            connectString : dbConfig.connectString
        },
        function(err, connection) {
            if(err) {
                console.log(err.message);
                return;
            }

            // PrepareStatement 구조
            let query = 
                'INSERT INTO h_user(userid, password, username, address)' +
                'VALUES(:userid, :password, :username, :address)';
            
            let bindata = [
                request.body.userid,
                request.body.password,
                request.body.username,
                request.body.address
            ];

            connection.execute(query, bindata, function(err, result) {
                if(err) {
                    console.error(err.message);
                    doRelease(connection);
                    return;
                }

                console.log('Row Insert: ' + result.rowsAffected);

                doRelease(connection, reult.rowsAffected);
            });
        }
    );

    function doRelease(connection, result) {
        connection.release(function(err) {
            if(err) {
                console.error(err.message);
            }

            response.send(''+result);
        })
    }


});

app.use('/', router);

app.all('*', function(req, res) {
    res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});