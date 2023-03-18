import pluginPkg from '../../package.json';

const pluginId = pluginPkg.name.replace(/^(@[^-,.][\w,-]+\/|strapi-)plugin-/i, '');

console.log({ pluginId });

export default pluginId;
