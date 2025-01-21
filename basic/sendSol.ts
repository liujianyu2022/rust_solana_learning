
import { Connection, Keypair, PublicKey, SystemProgram, Transaction } from "@solana/web3.js"
import { DEVNETQUICKNODE } from "../client/constants"
import loadKeypair from "../tools/loadKeypair"


const connection = new Connection(DEVNETQUICKNODE, "confirmed")

const payer = loadKeypair("/home/liujianyu/.config/solana/id.json")
const receiverPublicKey = new PublicKey("GYLdtQ6MpGq6qeDqtjUFDLZaeqybz3ceHDezyHQp523A")
const amountInSol = 0.01
const lamports = amountInSol * 1e9

const transaction = new Transaction().add(
    SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: receiverPublicKey,
        lamports,
    })
);

const sendTransaction = async () => {
    try {
        // 获取最新的区块信息
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");

        // 设置交易的区块哈希
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = payer.publicKey;

        // 签署交易
        transaction.sign(payer);

        // 序列化并发送交易
        const signature = await connection.sendRawTransaction(transaction.serialize());
        console.log(`Transaction sent. Signature: ${signature}`);

        // 使用新的 confirmTransaction 方法
        const confirmation = await connection.confirmTransaction({ 
            signature, 
            blockhash, 
            lastValidBlockHeight 
        }, "confirmed")

        console.log("Transaction confirmed:", confirmation);

    } catch (error) {
        console.error("Error sending transaction:", error);
    }
};

sendTransaction();
