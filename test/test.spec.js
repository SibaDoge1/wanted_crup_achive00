const auth = require('../routes/auth');
const models = require("../models");
const app = require('../app');
const util = require('../util');

const crypto = require('crypto');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
chai.use(chaiHttp);

function createUser(userid, callback){
    let password = "asd"; 
    let salt = Math.round((new Date().valueOf() * Math.random())) + ""; 
    let hashPassword = crypto.createHash("sha512").update(password + salt).digest("hex");

    models.user.create({
        userid: userid,
        password: hashPassword,
        salt: salt
      })
      .then( result => {
        //util.log(`user [${result.userid}] created!`);
        callback(null, result);
      })
      .catch( err => {
        console.log(err);
        callback(err, null);
    });
}

function createPost(body, callback){
    models.post.bulkCreate(body)
      .then( result => {
        callback(null, result);
      })
      .catch( err => {
          console.log(err);
        callback(err, null);
    });

}


// beforeEach((done) => {
//     models.sequelize.sync({force:true}).then( () => {
//         done();
//       }).catch();
// });

describe('/POST /api/users', () => {
    it('it should make an User', (done) => {
        let body = {
            userid: "test",
            password: "asd"
        }
        chai.request(app)
            .post('/api/users')
            .send(body)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('Object');
                res.body.success.should.be.ok;
                done();
            });
    });
    
});


describe('/GET /api/users', () => {
    it('it should GET All users', (done) => {
        chai.request(app)
            .get('/api/users')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('Object');
                res.body.success.should.be.ok;
                done();
            });
    });
});


let token = "";

describe('/GET /api/auth', () => {

    it('it should GET a Token', (done) => {
        chai.request(app)
                .get('/api/auth?userid='+"test"+"&password="+"asd")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('Object');
                    res.body.success.should.be.ok;
                    res.body.data.token.should.exist;
                    token = res.body.data.token;
                    done();
                });

    });
});


describe('POSTS', () => {

    describe('/POST /api/posts/:postid', () => {
        it('it should make a Post', (done) => {
            let body = {
                title: "test",
                content: "helloworld"
            }
            chai.request(app)
                    .post('/api/posts')
                    .set({'x-access-token':token})
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('Object');
                        res.body.success.should.be.ok;
                        res.body.data.postid.should.equal(1);
                        done();
                    });

        });
    });
    
    describe('/PUT /api/posts/:postid', () => {    
        it('it should update a Post', (done) => {
            let body = {
                title: "test",
                content: "helloworld"
            }
            chai.request(app)
                    .put('/api/posts/'+'1')
                    .set({'x-access-token':token})
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('Object');
                        res.body.success.should.be.ok;
                        done();
                    });

        });
    });

    describe('/DELETE /api/posts/:postid', () => {    
        it('it should delete a Post', (done) => {
            let body = {
                title: "test",
                content: "helloworld"
            }
            chai.request(app)
                    .delete('/api/posts/'+'1')
                    .set({'x-access-token':token})
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('Object');
                        res.body.success.should.be.ok;
                        done();
                    });
        });
    });

    describe('/GET /api/posts', () => {    
        before((done) => {
            createPost([
                {author:"test", title:"testpost",content:"hi"},
                {author:"test", title:"testpost2",content:"hi2"},
                {author:"test", title:"testpost3",content:"hi3"},
                {author:"test", title:"testpost4",content:"hi4"},
                {author:"test", title:"testpost5",content:"hi5"},
            ], (err,res)=>{
                done();
            });
        });

        it('it should get All Posts', (done) => {
            let body = {
                title: "te1243sto1st",
                content: "helloworld"
            }
            chai.request(app)
                    .get('/api/posts')
                    .set({'x-access-token':token})
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('Object');
                        res.body.success.should.be.ok;
                        res.body.data.count.should.exist;
                        res.body.data.posts.should.exist;
                        done();
                    });
        });

        it('it should get A Post', (done) => {
            let body = {
                title: "te1243sto1st",
                content: "helloworld"
            }
            chai.request(app)
                    .get('/api/posts/'+'2')
                    .set({'x-access-token':token})
                    .send(body)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('Object');
                        res.body.success.should.be.ok;
                        res.body.data.should.exist;
                        done();
                    });
        });
    });
});