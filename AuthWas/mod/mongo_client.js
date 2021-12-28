
const mongoose = require('mongoose');

module.exports = ()=>{
    const connect = ()=>{
        mongoose.connect(process.env.MONGO_URL , {
				useNewUrlParser: true,
				useUnifiedTopology: true
        } , (error)=>{
                if(error){
					console.error(`몽고디비연결에러:${error}`);
				}else{
					console.info('몽고디비연결성공...');
				}

        });
    }

    mongoose.connection.on('error',(error)=>{
      console.error(`몽고디비연결에러${error}`);
    });

    mongoose.connection.on('disconnected',()=>{
        console.error('몽고디비연결이끊겼습니다.연결을재시도합니다.');
        connect();
    });

    return {
        connection : ()=>{
            connect();
        }
    }

}