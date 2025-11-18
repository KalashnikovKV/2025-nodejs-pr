const os = require('os');

class Logger {
  #isVerboseModeEnabled = false;
  #isQuietModeEnabled = false;

  constructor(verbose = false, quiet = false) {
    this.#isVerboseModeEnabled = verbose;
    this.#isQuietModeEnabled = quiet;
  }

  #getSystemInfo() {
    const timestamp = new Date().toISOString();
    const platform = os.platform();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const cpus = os.cpus();
    const cpuModel = cpus.length > 0 ? cpus[0].model : 'Unknown';

    return {
      timestamp,
      platform,
      totalMemory: (totalMemory / 1024 / 1024 / 1024).toFixed(2),
      freeMemory: (freeMemory / 1024 / 1024 / 1024).toFixed(2),
      cpuModel
    };
  }

  #logSystemInfo() {
    const info = this.#getSystemInfo();
    console.log(`Timestamp: ${info.timestamp}`);
    console.log(`Platform: ${info.platform}`);
    console.log(`Total Memory: ${info.totalMemory} GB`);
    console.log(`Free Memory: ${info.freeMemory} GB`);
    console.log(`CPU Model: ${info.cpuModel}`);
  }

  log(...data) {
    if (this.#isQuietModeEnabled) {
      return;
    }

    console.log(...data);

    if (this.#isVerboseModeEnabled) {
      this.#logSystemInfo();
    }
  }
}

module.exports = Logger;
