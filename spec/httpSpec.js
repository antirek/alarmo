const request = require('request');
const httpServer = require('../lib/http');

const config = {
    port: '3333',
    nodes: [
        {
            id: 1,
            name: 'test.ru',
            token: '1',
            ami: {
                port: 5038,
                host: 'localhost',
                username: 'ttt',
                secret: '123456'
            }
        }
    ],
    baseRecordUrl: 'http://records/'
};

let UserModel = {
    find: () => {
        return Promise.resolve([
            {
                chatId: 1,
                number: '791234'
            },
            {
                chatId: 2,
                number: '739156'
            }
        ]);
    },
    findOne: () => {
        return Promise.resolve({
            chatId: 1, 
            number: '791234'
        });
    }
};

let telegramApp = {
    telegram: {
        sendMessage: (chatId, text) => {
            console.log(chatId, text);
        }
    }
};


describe('number', () => {
    it('should return 200 response code on index', (done) => {
        let http = new httpServer(UserModel, telegramApp);
        
        var s = http.expressApp.listen(config.port, () => {
            let endpoint = 'http://localhost:' + config.port + '/';
            request.get(endpoint, (error, response) => {
                //console.log(error, response.body)
                expect(response.statusCode).toEqual(200);
                s.close(done);
            });
        });
    });

    it('should return 200 on post data', (done) => {
        let http = new httpServer(UserModel, telegramApp);
        
        var s = http.expressApp.listen(config.port, () => {
            let endpoint = 'http://localhost:' + config.port + '/send/791234';
            let data = {text: 'test text'};

            request.post(endpoint,{body: data, json: true}, (error, response) => {
                //console.log(error, response.body)
                expect(response.statusCode).toEqual(200);
                s.close(done);
            });
        });
    });

});