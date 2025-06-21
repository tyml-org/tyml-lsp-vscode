import { chmodSync } from 'fs';
import { execSync } from 'child_process';
const bin = `./server/tyml-lsp-server-macos-aarch64`;
chmodSync(bin, 0o755);
try {
    execSync(`xattr -d com.apple.quarantine "${bin}"`);
} catch (_) { /* ignore when no attribute */ }