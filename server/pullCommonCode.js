/**
 * 拉取公共代码库
 */

const {execSync} = require('child_process');
const fs = require('fs');
const {userKConfigPath, resolveApp} = require('../config/paths');
const gitCommon = require(userKConfigPath).gitCommon;

const gitClone = (repo, targetPath) => {
  return new Promise(resolve => {
    execSync(`git clone ${repo} ${targetPath}`, (err, out) => {
      if (err) {
        console.log(err);
        return;
      }

      resolve();
    });
  });
};

const gitPull = targetPath => {
  return new Promise(resolve => {
    execSync('git pull',{cwd: targetPath}, (err, out) => {
      if (err) {
        console.log(err);
        return;
      }

      resolve();
    });
  });
};

// 判断是否存在yarn
const isYarn = () => {
	try {
		execSync('yarnpkg --version', {stdio: 'ignore'});
		return true;
	} catch (e) {
		return false;
	}
};

const install = targetPath => {
  if (isYarn) {
    execSync('yarn', {cwd: targetPath}, (err, out) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  }
  else {
    execSync('npm install', {cwd: targetPath}, (err, out) => {
      if (err) {
        console.log(err);
        return;
      }
    });
  }
};

if (gitCommon) {
  const modulePath = resolveApp('src/page/node_modules');

  try {
    fs.mkdirSync(modulePath);
  }
  catch(err){}

  const packages = fs.readdirSync(modulePath);

  for (let item of gitCommon) {
    const repo = item.repo;
    if (repo) {
      const gitName = repo.split('/').slice(-1)[0].replace('.git', '');
      const targetPath = `${modulePath}/${gitName}`;

      if (packages.indexOf(gitName) > -1) {
        gitPull(targetPath).then(() => {
          install(targetPath);
        });
      }
      else {
        gitClone(repo, targetPath).then(() => {
          install(targetPath);
        });
      }
    }
  }
}
