// webpack.config.js

module.exports = function(env)
{
  const config =
  {
    entry: __dirname + '/src/index.js',
    devtool: 'source-map',
    output:
    {
      path: __dirname + '/lib',
      filename: env.fileName,
      library: env.libName,
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    module:
    {
      loaders:
      [
        {
          test: /(\.js)$/,
          exclude: /node_modules/,
          use:
          [
            {
              loader: 'babel-loader',
              options:{
                presets: ['es2015']
              }
            },
            {
              loader: 'eslint-loader',
              options:{
                configFile: '.eslintrc.json'
              }
            }
          ]
        }
      ]
    },
    resolve:
    {
      extensions: ['.js']
    }
  };

  return config;
}
