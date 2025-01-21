import { Connection, PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";
import { DEVNETALCHEMY } from "../client/constants";
import { Metaplex } from "@metaplex-foundation/js";


const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")    // a constant in the all situation for devnet, mainnet, locahost

const tokenMintAddress = "So11111111111111111111111111111111111111112";                     // wrapped sol
const tokenMint = new PublicKey(tokenMintAddress);

const connection = new Connection(DEVNETALCHEMY, "confirmed");

async function main1() {
    try {

        // Fetch token metadata
        const [ metadataAddress ] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("metadata"),
                METADATA_PROGRAM_ID.toBuffer(),
                tokenMint.toBuffer(),
            ],
            METADATA_PROGRAM_ID
        );

        // Fetch account info for the metadata address
        const metadata = await connection.getAccountInfo(metadataAddress)

        if (!metadata) throw new Error("Metadata account not found!");

        console.log("Token Metadata1 = ", metadata);

    } catch (error) {
        console.error("Failed to fetch metadata:", error);
    }
}

async function main2() {
    try {
        const metaplex = new Metaplex(connection)

        const tokenMint = new PublicKey(tokenMintAddress)
    
        const nft = await metaplex.nfts().findByMint({ mintAddress: tokenMint });
    
        console.log("Token Metadata2 = ", nft)

    }catch (error) {
        console.error("Failed to fetch metadata:", error);
    }
}

main1()
main2()