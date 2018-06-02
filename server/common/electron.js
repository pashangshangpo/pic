/**
 * electron服务进程
 */

const electron = require('electron');
const proc = require('child_process');
const chokidar = require('chokidar');
const { resolve } = require('path');

// 创建进程
const create = () => {
  const el = proc.spawn(electron, ['.']);

  el.stdout.on('data', function (data) {
    log('Electron', data.toString())
  });

  el.stderr.on('data', function (err) {
    log('Electron', err.toString())
  });

  return el;
};

module.exports = () => {
  return new Promise(resol => {
    let el = create();

    // 如果文件发生变化则重启服务
    const watcher = chokidar.watch([resolve('.', 'app')]).on('change', () => {
      watcher.close()
      process.kill(el.pid)
      el = null
      resol('start');
    });
  })
}
