const fs = require("fs");
const origReadlink = fs.readlink;
const origReadlinkSync = fs.readlinkSync;

fs.readlink = function (path, opts, cb) {
  if (typeof opts === "function") {
    cb = opts;
    opts = undefined;
  }
  origReadlink(path, opts, (err, result) => {
    if (err && err.code === "EISDIR") {
      return cb(null, Buffer.isBuffer(path) ? Buffer.from("") : "");
    }
    cb(err, result);
  });
};

fs.readlinkSync = function (path, opts) {
  try {
    return origReadlinkSync(path, opts);
  } catch (err) {
    if (err.code === "EISDIR") {
      return Buffer.isBuffer(path) ? Buffer.from("") : "";
    }
    throw err;
  }
};

// Patch fs.promises.readlink
const origPromisesReadlink = fs.promises.readlink;
fs.promises.readlink = async function (path, opts) {
  try {
    return await origPromisesReadlink(path, opts);
  } catch (err) {
    if (err.code === "EISDIR") {
      return Buffer.isBuffer(path) ? Buffer.from("") : "";
    }
    throw err;
  }
};

// Patch graceful-fs if present
try {
  const gfs = require("graceful-fs");
  if (gfs) {
    gfs.readlink = fs.readlink;
    gfs.readlinkSync = fs.readlinkSync;
    if (gfs.promises) {
      gfs.promises.readlink = fs.promises.readlink;
    }
  }
} catch (e) {}

// Patch linked-next-* style graceful-fs inside next
try {
  const lfs = require("next/dist/compiled/graceful-fs");
  if (lfs) {
    lfs.readlink = fs.readlink;
    lfs.readlinkSync = fs.readlinkSync;
  }
} catch (e) {}
