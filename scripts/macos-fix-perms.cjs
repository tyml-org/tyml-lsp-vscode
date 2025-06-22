const { chmodSync } = require('fs');
const { execSync } = require('child_process');

const bin = `${__dirname}/../server/tyml-lsp-server-macos-aarch64`;

chmodSync(bin, 0o755);
try { execSync(`xattr -d com.apple.quarantine "${bin}"`); } catch (_) {}