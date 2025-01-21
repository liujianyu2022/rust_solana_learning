import { Keypair } from "@solana/web3.js"
import fs from "fs"

const loadKeypair = (path: string): Keypair => {
    const keyData = JSON.parse(fs.readFileSync(path, "utf-8"))
    return Keypair.fromSecretKey(Uint8Array.from(keyData))
}

export default loadKeypair