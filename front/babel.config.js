const removeConsolePlugin = [];

if (
  process.env.NODE_ENV === 'staging' ||
  process.env.NODE_ENV === 'production'
) {
  removeConsolePlugin.push('transform-remove-console');
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [...removeConsolePlugin, '@babel/plugin-transform-private-methods'],
};
