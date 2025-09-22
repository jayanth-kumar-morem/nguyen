## Nguyen Anchor Program

### What this does
- Creates an SPL token mint and its Metaplex metadata via CPI.
- Creates a sample PDA account and allows updating it.

### Prerequisites
- Solana CLI and local validator available
- Anchor CLI 0.31.x
- Node.js 18+ and Yarn

### Install
```bash
yarn install
```

### Build
```bash
anchor build
```

### Test (with verbose logs)
- The test validator clones Metaplex Token Metadata so CPIs succeed.
- See `Anchor.toml` under `[test.validator]` for the clone entry and `[test]` for `startup_wait`.

Run:
```bash
anchor test
```

### On-chain instructions
- `initialize()`
- `create_token_mint(_token_decimals: u8, token_name: String, token_symbol: String, token_uri: String)`
  - Accounts: `payer`, `metadata_account` (PDA), `mint_account` (init), `token_metadata_program`, `token_program`, `system_program`, `rent`
- `create_sample_account(value: u64)`
  - Accounts: `payer`, `authority`, `sample` (PDA init), `system_program`
- `update_sample_account(new_value: u64)`
  - Accounts: `authority`, `sample`

See `tests/nguyen.ts` for a complete example including PDA derivations and transaction logs.

### Notes
- Token Metadata Program: `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s`
- SPL Token Program: `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA`

### Run output (sample logs)

```
(base) jayanthkumar@Jayanths-MacBook-Air nguyen % anchor test
   Compiling nguyen v0.1.0 (/Users/jayanthkumar/Downloads/work/web3/nguyen/programs/nguyen)
warning: use of deprecated method `anchor_lang::prelude::AccountInfo::<'a>::realloc`: Use AccountInfo::resize() instead
 --> programs/nguyen/src/lib.rs:7:1
  |
7 | #[program]
  | ^^^^^^^^^^
  |
  = note: `#[warn(deprecated)]` on by default
  = note: this warning originates in the attribute macro `program` (in Nightly builds, run with -Z macro-backtrace for more info)

warning: `nguyen` (lib) generated 1 warning
    Finished `release` profile [optimized] target(s) in 1.54s
   Compiling nguyen v0.1.0 (/Users/jayanthkumar/Downloads/work/web3/nguyen/programs/nguyen)
    Finished `test` profile [unoptimized + debuginfo] target(s) in 1.16s
     Running unittests src/lib.rs (/Users/jayanthkumar/Downloads/work/web3/nguyen/target/debug/deps/nguyen-724537f27ffcbcb2)

Found a 'test' script in the Anchor.toml. Running it as a test suite!

Running test suite: "/Users/jayanthkumar/Downloads/work/web3/nguyen/Anchor.toml"






yarn run v1.22.22
$ /Users/jayanthkumar/Downloads/work/web3/nguyen/node_modules/.bin/ts-mocha -p ./tsconfig.json -t 1000000 'tests/**/*.ts'




(node:2318) ExperimentalWarning: Type Stripping is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
(node:2318) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/jayanthkumar/Downloads/work/web3/nguyen/tests/nguyen.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/jayanthkumar/Downloads/work/web3/nguyen/package.json.


  nguyen
Your transaction signature 4JZP53H56rDU4CPLEsKVRUy2p9DtfMUugQyHZNSDXXH7FpF83SX8wrK9oHDXfc8XCPMM4fr3yScMGEQ3C9Eqft6o
    ✔ Is initialized! (453ms)

================= TEST START =================
Cluster: { 'feature-set': 1416569292, 'solana-core': '2.1.22' }
Program ID: CaanqYN5mLLf8zR7dcdHSiohkxh4cnG7cJ4KPRckUVbp
Payer: BteepNLJMAPjmAEgsdZJWpwbsyDfW5kYA8tMDL1CDj9Q
Airdrop signature: 2rNWhjV2RQBvSuKxqf648v8B4VbQB3TkaEKG8Hndzw6Y9vUqhDfcA5zqPGgUN116i3k8D4BwNVBMvspxBmodKkAX



Airdrop confirmed
Mint Keypair pubkey: Enq5EB68osynTahZAUQcv6M7aHzfK9hXkZR1V1MMskD2
Derived metadata PDA: 5cKWdNChp84gNmzmGsh1RNkVnxHNmuMecQ6jvMJS4RXQ bump: 254
Calling create_token_mint... {
  decimals: 9,
  name: 'Nguyen Token',
  symbol: 'NGUYEN',
  uri: 'https://example.com/nguyen-token.json',
  metadataPda: '5cKWdNChp84gNmzmGsh1RNkVnxHNmuMecQ6jvMJS4RXQ',
  mint: 'Enq5EB68osynTahZAUQcv6M7aHzfK9hXkZR1V1MMskD2'
}
create_token_mint tx: 4ANDLmwmYTCWF76iPoE3DQTo75Sk7dbEU64hstbRVAaY1P2sm7KsrSFie5Y4dgZ85qcxfujmFkB2gzH5G3rNMR3c
Mint account exists? true
Mint account lamports: 1461600
Mint account owner: TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
Mint account data length: 82
Metadata account exists? true
Metadata account owner: metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s
Metadata account data length: 607
Derived sample PDA: 36UhNrA6GKfYWEhoh5VFuFC16bEGG58AcwEsZ2MF2bGu bump: 255
Calling create_sample_account... {
  samplePda: '36UhNrA6GKfYWEhoh5VFuFC16bEGG58AcwEsZ2MF2bGu',
  initialValue: '1234'
}
create_sample_account tx: 2r9zYjo3RWaRmbrzhJ5JeqFGyh9xkP5yLux15aMC3mWLifo24YyM6kgkVt6aY6EBio7gJ57yQ1LNPSTFuUkpNGA9
Sample after create: {
  authority: 'BteepNLJMAPjmAEgsdZJWpwbsyDfW5kYA8tMDL1CDj9Q',
  value: '1234',
  bump: 255
}
Calling update_sample_account... { newValue: '987654321' }
update_sample_account tx: 58QTLy7cxrumhhtVj5UDtDbsVSDbMxJ4gsFq3h4c7uPDLvgKfyFyC255Lqm7PL24btLhXMGJYujdxfkxz81QyRvx
Sample after update: {
  authority: 'BteepNLJMAPjmAEgsdZJWpwbsyDfW5kYA8tMDL1CDj9Q',
  value: '987654321',
  bump: 255
}
================= TEST END =================

    ✔ Creates token mint with metadata, creates and updates sample PDA (1872ms)


  2 passing (2s)

✨  Done in 3.68s.
```

### Security and performance review

- Strengths
  - Uses `Program<Metadata>` and `Program<Token>` which anchor to the correct program IDs at runtime.
  - Derives the metadata PDA with `seeds::program = token_metadata_program.key()` and validates via seeds, preventing spoofed PDAs.
  - PDA account for sample data uses `has_one = authority` and signer checks, preventing unauthorized updates.

- Recommended improvements
  - Enforce the known Metadata program ID defensively in the handler, even though `Program<Metadata>` already constrains it.
  - Add input length checks for `token_name`, `token_symbol`, and `token_uri` to fail early before CPI. Safe, commonly used limits are `name ≤ 32`, `symbol ≤ 10`, `uri ≤ 200`.
  - Decide freeze behavior explicitly:
    - If you want tokens to be non-freezable: keep freeze authority as `None` (current behavior when unspecified), or set it explicitly to `None`.
    - If you want freeze control: set `mint::freeze_authority = payer.key()`.
  - Validate decimals (e.g., `0 ≤ decimals ≤ 9`) to avoid non-standard configurations.
  - Prefer minimal `msg!` logs in production to save compute; keep verbose logs for testing only.
  - Optionally remove unused errors (e.g., `BumpNotFound` if no longer used) to reduce binary size.

- Example code hardening (handler)

```rust
use anchor_lang::prelude::*;
use anchor_spl::metadata::Metadata;

require_keys_eq!(
    ctx.accounts.token_metadata_program.key(),
    Metadata::id(),
    MyError::InvalidMetadataProgram
);

require!(token_name.len() <= 32, MyError::NameTooLong);
require!(token_symbol.len() <= 10, MyError::SymbolTooLong);
require!(token_uri.len() <= 200, MyError::UriTooLong);
require!(_token_decimals <= 9, MyError::InvalidDecimals);
```

- Example explicit freeze authority (accounts)

```rust
#[account(
    init,
    payer = payer,
    mint::decimals = _token_decimals,
    mint::authority = payer.key(),
    // choose one of the following explicitly
    // mint::freeze_authority = payer.key(),      // freezable
    // OR leave unset / set to None for non-freezable mint
)]
pub mint_account: Account<'info, Mint>;
```

- Client performance tips
  - When submitting the transaction, prepend a compute budget instruction (increase CU limit and add priority fee) to reduce CPI-related failures under load.
  - Batch multiple operations in one transaction only if compute fits; otherwise split into separate transactions.