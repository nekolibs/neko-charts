module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['module-resolver', {
      alias: {
        'react-native': 'react-native-web',
        'react-native-svg': 'react-native-svg-web'
      }
    }]
  ]
}