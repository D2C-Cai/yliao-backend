module.exports = {
    devServer: {
        port: 8081,
        // proxy: 'https://mana.fune.store/back/'
        proxy: 'http://192.168.0.143:8002/back'
        //proxy: 'https://mana.yliao.com/back'
    }
}
