import { PublicKey } from "@solana/web3.js";

export async function getAssociatedTokenAddress(
    mint: PublicKey,
    owner: PublicKey,
    allowOwnerOffCurve = false,
    programId = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    associatedTokenProgramId = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'),
): Promise<PublicKey> {
    
    if (!allowOwnerOffCurve && !PublicKey.isOnCurve(owner.toBuffer())) throw Error("TokenOwnerOffCurveError");

    const [associatedAddress] = PublicKey.findProgramAddressSync(
        [
            owner.toBuffer(),
            programId.toBuffer(),
            mint.toBuffer()
        ],
        associatedTokenProgramId
    )

    return associatedAddress
}