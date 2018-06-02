/**
 * 自动安装依赖
 */
const {execSync} = require('child_process');
const fs = require('fs');
const {resolveApp} = require('../config/paths');

// 判断是否存在yarn
const isYarn = () => {
	try {
		execSync('yarnpkg --version', {stdio: 'ignore'});
		return true;
	} catch (e) {
		return false;
	}
};

// 判断是否安装过依赖
const isInstall = (rootPath = './') => {
  // package路径
  const packagePath = resolveApp(rootPath, 'package.json');
  const packageJson = require(packagePath);

  // nodeModule路径
  const nodeModulePath = resolveApp(rootPath, 'node_modules');

	let nodeModule = '';
	try {
		nodeModule = fs.readdirSync(nodeModulePath);
	} catch (e) {
		return false;
	}

	const installPackageName = Object.assign({}, packageJson.dependencies, packageJson.devDependencies);

	return Object.keys(installPackageName).every(packageName => {
		return nodeModule.some(item => item === packageName);
	});
};

// 安装依赖
const install = () => {
  ['./', 'src', 'app'].forEach(path => {
    if (!isInstall(path)) {
      console.log(`正在为您安装${path !== './' ? path : 'root'}目录下的依赖`);
  
      if (isYarn()) {
        execSync('yarnpkg install', {
          cwd: path,
          stdio: 'inherit'
        });
      } else {
        execSync('npm install', {
          cwd: path,
          stdio: 'inherit'
        });
      }
    }
  })
};

install();
