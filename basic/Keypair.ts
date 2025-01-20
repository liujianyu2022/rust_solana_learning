import { Keypair } from '@solana/web3.js';

const keypair1 = Keypair.generate()                                 // 创建一个新的 Keypair（用于发送交易）
console.log("public key1 = ", keypair1.publicKey.toBase58())
console.log("secret key1 = ", keypair1.secretKey)

const keypair2 = Keypair.fromSecretKey(keypair1.secretKey)
console.log("public key2 = ", keypair2.publicKey.toBase58())
console.log("secret key2 = ", keypair2.secretKey)




