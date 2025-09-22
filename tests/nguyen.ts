import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Nguyen } from "../target/types/nguyen";
import { PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

describe("nguyen", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.nguyen as Program<Nguyen>;
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const connection = provider.connection;
  const wallet = provider.wallet as anchor.Wallet;

  // Metaplex Token Metadata Program ID
  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
  );

  // SPL Token Program ID (legacy token program)
  const TOKEN_PROGRAM_ID = new PublicKey(
    "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
  );

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });

  it("Creates token mint with metadata, creates and updates sample PDA", async () => {
    console.log("\n================= TEST START =================");
    console.log("Cluster:", await connection.getVersion());
    console.log("Program ID:", program.programId.toBase58());
    console.log("Payer:", wallet.publicKey.toBase58());

    // Airdrop some SOL to ensure we have funds (localnet)
    try {
      const sig = await connection.requestAirdrop(wallet.publicKey, 2 * LAMPORTS_PER_SOL);
      console.log("Airdrop signature:", sig);
      await connection.confirmTransaction(sig, "confirmed");
      console.log("Airdrop confirmed");
    } catch (e) {
      console.log("Airdrop skipped or failed:", e);
    }

    // 1) Create token mint + metadata
    const mintKeypair = Keypair.generate();
    console.log("Mint Keypair pubkey:", mintKeypair.publicKey.toBase58());

    const [metadataPda, metadataBump] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );
    console.log("Derived metadata PDA:", metadataPda.toBase58(), "bump:", metadataBump);

    const decimals = 9;
    const name = "Nguyen Token";
    const symbol = "NGUYEN";
    const uri = "https://example.com/nguyen-token.json";

    console.log("Calling create_token_mint...", {
      decimals,
      name,
      symbol,
      uri,
      metadataPda: metadataPda.toBase58(),
      mint: mintKeypair.publicKey.toBase58(),
    });

    const txCreateToken = await program.methods
      .createTokenMint(decimals, name, symbol, uri)
      .accounts({
        payer: wallet.publicKey,
        metadataAccount: metadataPda,
        mintAccount: mintKeypair.publicKey,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([mintKeypair])
      .rpc();

    console.log("create_token_mint tx:", txCreateToken);

    const mintInfo = await connection.getAccountInfo(mintKeypair.publicKey);
    console.log("Mint account exists?", mintInfo !== null);
    console.log("Mint account lamports:", mintInfo?.lamports);
    console.log("Mint account owner:", mintInfo?.owner.toBase58());
    console.log("Mint account data length:", mintInfo?.data.length);

    const mdInfo = await connection.getAccountInfo(metadataPda);
    console.log("Metadata account exists?", mdInfo !== null);
    console.log("Metadata account owner:", mdInfo?.owner.toBase58());
    console.log("Metadata account data length:", mdInfo?.data.length);

    // 2) Create sample PDA
    const [samplePda, sampleBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("sample"), wallet.publicKey.toBuffer()],
      program.programId
    );
    console.log("Derived sample PDA:", samplePda.toBase58(), "bump:", sampleBump);

    const initialValue = new anchor.BN(1234);
    console.log("Calling create_sample_account...", {
      samplePda: samplePda.toBase58(),
      initialValue: initialValue.toString(),
    });

    const txCreateSample = await program.methods
      .createSampleAccount(initialValue)
      .accounts({
        payer: wallet.publicKey,
        authority: wallet.publicKey,
        sample: samplePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log("create_sample_account tx:", txCreateSample);

    const sampleAfterCreate = await program.account.sampleAccount.fetch(samplePda);
    console.log("Sample after create:", {
      authority: (sampleAfterCreate as any).authority.toBase58?.() || (sampleAfterCreate as any).authority,
      value: (sampleAfterCreate as any).value.toString?.() || (sampleAfterCreate as any).value,
      bump: (sampleAfterCreate as any).bump,
    });

    // 3) Update sample PDA
    const newValue = new anchor.BN(987654321);
    console.log("Calling update_sample_account...", {
      newValue: newValue.toString(),
    });

    const txUpdateSample = await program.methods
      .updateSampleAccount(newValue)
      .accounts({
        authority: wallet.publicKey,
        sample: samplePda,
      })
      .rpc();
    console.log("update_sample_account tx:", txUpdateSample);

    const sampleAfterUpdate = await program.account.sampleAccount.fetch(samplePda);
    console.log("Sample after update:", {
      authority: (sampleAfterUpdate as any).authority.toBase58?.() || (sampleAfterUpdate as any).authority,
      value: (sampleAfterUpdate as any).value.toString?.() || (sampleAfterUpdate as any).value,
      bump: (sampleAfterUpdate as any).bump,
    });

    console.log("================= TEST END =================\n");
  });
});
