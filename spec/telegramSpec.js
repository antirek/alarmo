const request = require('request');
const telegramServer = require('../lib/telegram');
const console = require('tracer').colorConsole();

class UserModel {
    find () {
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
    };

    findOne ({chatId}) {
        if (chatId == '11111111') {
            return Promise.resolve({
                chatId: 1,  
                number: '791234'
            });
        } else {
            return Promise.resolve(null);
        }
    };
};

let from1 = {
    id: 1212121212,
    last_name: '12',
    first_name: '12'
};

let from2 = {
    id: 11111111,
    last_name: '12',
    first_name: '12'
}

let cb = (q) => {

}

let getCtx = (from) => {
    return {
        from: from,
        update: {
            message: {
                from: from
            }
        },
        reply: (text) => {
            cb(text);
        },
        message: {
            contact: {
                user_id: 11111111,
                phone_number: '791234'
            }
        }
    }
}


let getTelegrafApp = (ctx1, ctx2) => {
    return {
        command: (param, callback) => {
            if (param == 'start') {
                callback(ctx1)
            }
        },
        use: () => {

        },
        on: (param, callback) => {
            if (param == 'contact') {
                //callback(ctx2)
            } 
        }
    }
}

let Messages = {
    hello: "hello %s",
    exist: "exist %s",
    registered: 'registered %s',
    notyournumber: 'notyournumber %s'
}

describe('number', () => {
    it('should request number', (done) => {
        let telegrafApp = getTelegrafApp(getCtx(from1));
        console.log(telegrafApp)
        cb = (q) => {
            expect(q).toEqual('hello 12 12');
            done();
        }
        let http = new telegramServer(telegrafApp, new UserModel(), Messages);
    });

    it('should detect exist user', (done) => {
        let telegrafApp = getTelegrafApp(getCtx(from2));
        console.log(telegrafApp)
        cb = (q) => {
            expect(q).toEqual('exist 12 12');
            done();
        }
        let http = new telegramServer(telegrafApp, new UserModel(), Messages);
    });

});