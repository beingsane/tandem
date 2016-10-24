const glob     = require('glob');
const { join } = require('path');

const BASE_DIR             = process.cwd();
const SRC_DIR              = join(BASE_DIR, 'packages');
const OUT_DIR              = join(BASE_DIR, 'out');
const MEGA_PKG_FILE_PATH   = join(OUT_DIR, 'package.json');
const OUT_NODE_MODULES_DIR = join(OUT_DIR, 'node_modules');

const PACKAGE_FILE_PATHS = glob.sync(join(SRC_DIR, '**', 'package.json'));
const PACKAGES           = PACKAGE_FILE_PATHS.map(require);
const PACKAGE_NAMES      = PACKAGES.map(({name}) => name);

module.exports = {
  BASE_DIR,
  SRC_DIR,
  OUT_DIR,
  MEGA_PKG_FILE_PATH,
  OUT_NODE_MODULES_DIR,
  PACKAGE_FILE_PATHS,
  PACKAGES,
  PACKAGE_NAMES
};
