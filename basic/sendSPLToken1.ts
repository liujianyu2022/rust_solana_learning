import { Connection, Transaction, PublicKey, sendAndConfirmTransaction, TransactionInstruction } from '@solana/web3.js'

import { DEVNET_QUICK_NODE, SPL_TOKEN_ASSOCIATED_PROGRAM_ID, SPL_TOKEN_PROGRAM_ID, USDC_DEVNET_ADDRESS } from '../client/constants';
import loadKeypair from '../tools/loadKeypair';

// Solana Devnet 连接
const connection = new Connection(DEVNET_QUICK_NODE, 'confirmed');

const payer = loadKeypair("/home/liujianyu/.config/solana/id.json")
const payerPublicKey = payer.publicKey

const receiverPublicKey = new PublicKey('GYLdtQ6MpGq6qeDqtjUFDLZaeqybz3ceHDezyHQp523A');    // 替换为接收方的公钥
const tokenAddress = new PublicKey(USDC_DEVNET_ADDRESS)                                     // 替换为实际的 Token Mint 地址

const PROGRAM_ID = new PublicKey(SPL_TOKEN_PROGRAM_ID)
const ASSOCIATED_PROGRAM_ID = new PublicKey(SPL_TOKEN_ASSOCIATED_PROGRAM_ID)

const DECIMALS = 1e6

// 在 Solana 的 SPL Token 标准中，代币不是直接存储在用户的主账户（也称为 Solana 钱包地址）中，而是存储在专门的代币账户中。
// getAssociatedTokenAddress 是用来计算用户对于某种特定 SPL Token 的关联账户地址的工具函数。
// SPL Token 程序的主要功能是支持基于 Solana 的代币管理，包括：
// 1. 创建新的 SPL Token。
// 2. 管理代币账户（如创建、转账、授权操作）。
// 3. 处理代币的供应和销毁。
async function getAssociatedTokenAddress(mint: PublicKey, owner: PublicKey,): Promise<PublicKey> {

    if (!PublicKey.isOnCurve(owner.toBuffer())) throw Error("TokenOwnerOffCurveError");

    const [associatedAddress] = PublicKey.findProgramAddressSync(
        [
            owner.toBuffer(),
            PROGRAM_ID.toBuffer(),
            mint.toBuffer()
        ],
        ASSOCIATED_PROGRAM_ID
    )

    return associatedAddress
}

// 检查账户是否存在
async function checkAccountExists(publicKey: PublicKey): Promise<boolean> {
    const accountInfo = await connection.getAccountInfo(publicKey);
    return accountInfo !== null;
}


// 发送 SPL Token 的函数
async function sendSPLToken() {

    try {
        // 获取发送方和接收方的关联账户地址
        const senderTokenAccount = await getAssociatedTokenAddress(tokenAddress, payerPublicKey);
        const receiverTokenAccount = await getAssociatedTokenAddress(tokenAddress, receiverPublicKey);

        // 检查账户是否存在，否则抛出错误
        const senderExists = await checkAccountExists(senderTokenAccount);
        const receiverExists = await checkAccountExists(receiverTokenAccount);

        if (!senderExists) throw new Error(`Sender's token account does not exist: ${senderTokenAccount.toBase58()}`);
        if (!receiverExists) throw new Error(`Receiver's token account does not exist: ${receiverTokenAccount.toBase58()}`);

        // 构造转账指令
        const transferAmount = 1 * DECIMALS;

        // Solana 的 SPL Token 程序使用的指令码（instruction code）是固定的。转账指令的 instruction code 为 3
        // 其格式为：[instruction_code, amount (as little-endian u64)]  // rust
        const dataLayout = Buffer.alloc(9)                          // SPL Token 的转账指令数据长度是固定的 9 字节（1 字节的指令码 + 8 字节的金额）
        dataLayout.writeUInt8(3, 0)                                 // 将指令码 3 写入缓冲区的第 0 字节位置  在 SPL Token 程序中，指令码 3 代表 转账操作
        dataLayout.writeBigUInt64LE(BigInt(transferAmount), 1)      // 一个 64 位无符号整数（u64）写入缓冲区, 偏移量 1 意味着金额写入缓冲区的第 1 - 8 字节

        const transferInstruction = new TransactionInstruction({
            keys: [
                { pubkey: senderTokenAccount, isSigner: false, isWritable: true },
                { pubkey: receiverTokenAccount, isSigner: false, isWritable: true },

                { pubkey: payerPublicKey, isSigner: true, isWritable: false },
            ],
            programId: PROGRAM_ID,
            data: dataLayout,
        });

        // 构造事务并发送
        const transaction = new Transaction().add(transferInstruction)
        const signature = await sendAndConfirmTransaction(connection, transaction, [payer])

        console.log('Transaction confirmed with signature:', signature);
    } catch (error) {
        console.error("Error sending transaction:", error);
    }

}

sendSPLToken()
