const path = require('path');

module.exports = {
  devServer: (devServerConfig) => {
    // Ignoruj změny v public/references/ aby PHP uploady
    // nespouštěly live reload a nepřerušovaly probíhající nahrávání fotek.
    if (devServerConfig.static) {
      const statics = Array.isArray(devServerConfig.static)
        ? devServerConfig.static
        : [devServerConfig.static];

      devServerConfig.static = statics.map((s) => ({
        ...s,
        watch: {
          ...(typeof s.watch === 'object' && s.watch !== null ? s.watch : {}),
          ignored: [
            path.resolve(__dirname, 'public/references'),
            '**/node_modules/**',
          ],
        },
      }));
    }
    return devServerConfig;
  },
};
