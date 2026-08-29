module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
          },
        },
      ],
      [
        '@nozbe/watermelondb/babel',
        {
          dataMigrator: './src/lib/watermelon/migrations.ts',
        },
      ],
    ],
  };
};
