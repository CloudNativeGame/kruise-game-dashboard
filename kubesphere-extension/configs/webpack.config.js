const { resolve } = require('path')
const root = path => resolve(__dirname, `../${path}`)

module.exports = {
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                include: root("node_modules"),
                use: ["style-loader", "css-loader", "sass-loader"],
            },
        ],
    },
};