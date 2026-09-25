# ProofFactor Component Versions

Last verified: 2026-09-25

ProofFactor targets Midnight **Preprod**. All Midnight package versions must remain exact—no `^` or `~` ranges—and must be updated as a compatibility set.

## Compatibility baseline

| Component | Required version | Local status |
|---|---:|---|
| Compact devtools (`compact`) | `0.5.1` | Verified in WSL2 |
| Compact compiler/toolchain | `0.31.1` | Installed and verified in WSL2 |
| Compact runtime | `0.16.0` | Pin when application packages are installed |
| Compact JS | `2.5.1` | Pin when application packages are installed |
| Platform JS | `2.2.4` | Pin when application packages are installed |
| On-chain runtime | `3.0.0` | Pin when application packages are installed |
| Wallet SDK | `1.2.0` | Pin when wallet integration begins |
| Midnight.js | `4.1.1` | Pin when application packages are installed |
| testkit-js | `4.1.1` | Pin when contract integration tests begin |
| DApp Connector API | `4.0.1` | Pin when wallet integration begins |
| Preprod indexer | `4.3.302` | Remote service |
| Proof server | `8.1.0` | Docker Desktop installation in progress |
| Preprod node | `1.0.3` | Remote service |

## Host environment

| Component | Local version/status |
|---|---|
| Windows Node.js | `24.18.0` |
| npm | `11.16.0` |
| Git | `2.55.0.windows.2` |
| WSL | Ubuntu 22.04 on WSL2 |
| Docker Desktop | Installation pending verification |

## Verification commands

Run from PowerShell:

```powershell
node --version
npm --version
git --version
wsl -l -v
wsl -d Ubuntu-22.04 -- bash -lc 'compact --version && compact compile +0.31.1 --version'
docker --version
```

After the project dependencies exist:

```powershell
npm list --depth=0
npm run check:versions
```

## Compatibility source

- Midnight Preprod support matrix: <https://docs.midnight.network/relnotes/support-matrix>
- Version mismatch guidance: <https://docs.midnight.network/how-to/fix-version-mismatches>
- Windows/WSL setup: <https://docs.midnight.network/guides/windows-compact-setup>

Re-check the support matrix before any deployment or dependency upgrade.
