//필요한 모듈 선언
let express = require('express');
let oracledb = require('oracledb');
let http = require('http');
let app = express();

let config = {
    user : 'test_db',
    password: 'test_db',
    connectString : 'localhost/orcl'
}

//express 서버 포트 설정(cafe24 호스팅 서버는 8001 포트 사용)
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('port', process.env.PORT || 8001);


//서버 생성
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

//라우팅 모듈 선언
let indexRouter = require('./routes/index');
const userRouter = require('./routes/selectUser');
//request 요청 URL과 처리 로직을 선언한 라우팅 모듈 매핑
app.use('/', indexRouter);

app.use('/user', userRouter);

// 유저 정보 가져오기 테스트
app.get('/selectUser', (req, res) => {
    oracledb.getConnection(config, (err, conn) => {
        oracleTest(err, conn);
    });
    
    function oracleTest(err, connection) {
        if(err) {
            console.error(err.message);
            return;
        }
        connection.execute("select * from h_user", [] ,function(err, result) {
            if(err) {
                console.error(err.message);
            }
            res.send(result.rows);
        });
    }
});


