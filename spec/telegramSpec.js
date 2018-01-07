const request = require('request');
const telegramServer = require('../lib/telegram');
const console = require('tracer').colorConsole();

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
    findOne: ({chatId}) => {
        if (chatId == '11111111') {
            return Promise.resolve({
                chatId: 1,  
                number: '791234'
            });
        } else {
            return Promise.resolve(null);
        }
    }
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
        }
    }
}


let getTelegrafApp = (ctx) => {
    return {
        command: (param, callback) => {
            if (param == 'start') {
                callback(ctx)
            }
        },
        use: () => {

        },
        on: (param, callback) => {
            if (param == 'contact') {
                //callback('')
            } 
        }
    }
}

let Messages = {
    hello: "hello %s",
    exist: "exist %s"
}

describe('number', () => {
    it('should request number', (done) => {
        let telegrafApp = getTelegrafApp(getCtx(from1));
        console.log(telegrafApp)
        cb = (q) => {
            expect(q).toEqual('hello 12 12');
            done();
        }
        let http = new telegramServer(telegrafApp, UserModel, Messages);
    });

    it('should detect exist user', (done) => {
        let telegrafApp = getTelegrafApp(getCtx(from2));
        console.log(telegrafApp)
        cb = (q) => {
            expect(q).toEqual('exist 12 12');
            done();
        }
        let http = new telegramServer(telegrafApp, UserModel, Messages);
    });

});