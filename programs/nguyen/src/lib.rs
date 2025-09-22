use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};
use anchor_spl::metadata::{create_metadata_accounts_v3, CreateMetadataAccountsV3, Metadata, mpl_token_metadata::types::DataV2};

declare_id!("CaanqYN5mLLf8zR7dcdHSiohkxh4cnG7cJ4KPRckUVbp");

#[program]
pub mod nguyen {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    // 1) Create a new SPL token mint and its Metaplex metadata
    pub fn create_token_mint(
        ctx: Context<CreateTokenMint>,
        _token_decimals: u8,
        token_name: String,
        token_symbol: String,
        token_uri: String,
    ) -> Result<()> {
        msg!("Creating metadata account...");
        msg!("Metadata account address: {}", &ctx.accounts.metadata_account.key());

        create_metadata_accounts_v3(
            CpiContext::new(
                ctx.accounts.token_metadata_program.to_account_info(),
                CreateMetadataAccountsV3 {
                    metadata: ctx.accounts.metadata_account.to_account_info(),
                    mint: ctx.accounts.mint_account.to_account_info(),
                    mint_authority: ctx.accounts.payer.to_account_info(),
                    update_authority: ctx.accounts.payer.to_account_info(),
                    payer: ctx.accounts.payer.to_account_info(),
                    system_program: ctx.accounts.system_program.to_account_info(),
                    rent: ctx.accounts.rent.to_account_info(),
                },
            ),
            DataV2 {
                name: token_name,
                symbol: token_symbol,
                uri: token_uri,
                seller_fee_basis_points: 0,
                creators: None,
                collection: None,
                uses: None,
            },
            false,
            true,
            None,
        )?;

        msg!("Token mint created successfully.");

        Ok(())
    }

    // 2) Create sample PDA account data owned by this program
    pub fn create_sample_account(ctx: Context<CreateSampleAccount>, value: u64) -> Result<()> {
        let bump = ctx.bumps.sample;
        let sample = &mut ctx.accounts.sample;
        sample.authority = ctx.accounts.authority.key();
        sample.value = value;
        sample.bump = bump;
        Ok(())
    }

    // 3) Update the sample PDA account data (only the authority can update)
    pub fn update_sample_account(ctx: Context<UpdateSampleAccount>, new_value: u64) -> Result<()> {
        let sample = &mut ctx.accounts.sample;
        sample.value = new_value;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

// Accounts for creating a mint and its metadata
#[derive(Accounts)]
#[instruction(_token_decimals: u8)]
pub struct CreateTokenMint<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Validate address by deriving pda
    #[account(
        mut,
        seeds = [b"metadata", token_metadata_program.key().as_ref(), mint_account.key().as_ref()],
        bump,
        seeds::program = token_metadata_program.key(),
    )]
    pub metadata_account: UncheckedAccount<'info>,

    #[account(
        init,
        payer = payer,
        mint::decimals = _token_decimals,
        mint::authority = payer.key(),
    )]
    pub mint_account: Account<'info, Mint>,

    pub token_metadata_program: Program<'info, Metadata>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// Sample PDA account
#[account]
pub struct SampleAccount {
    pub authority: Pubkey,
    pub value: u64,
    pub bump: u8,
}

// Create the PDA account at seed ["sample", authority]
#[derive(Accounts)]
pub struct CreateSampleAccount<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    pub authority: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + 32 + 8 + 1,
        seeds = [b"sample", authority.key().as_ref()],
        bump
    )]
    pub sample: Account<'info, SampleAccount>,

    pub system_program: Program<'info, System>,
}

// Update the PDA account; must be signed by the stored authority
#[derive(Accounts)]
pub struct UpdateSampleAccount<'info> {
    pub authority: Signer<'info>,

    #[account(
        mut,
        seeds = [b"sample", authority.key().as_ref()],
        bump = sample.bump,
        has_one = authority
    )]
    pub sample: Account<'info, SampleAccount>,
}

// Errors
#[error_code]
pub enum ErrorCode {
    #[msg("Bump not found in context")]
    BumpNotFound,
}
