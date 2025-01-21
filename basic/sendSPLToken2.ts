import { Connection, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js"

// @ts-ignore
import { createTransferInstruction, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from "@solana/spl-token"

import { DEVNETQUICKNODE, USDC_DEVNET_ADDRESS } from "../client/constants.ts";
import loadKeypair from "../tools/loadKeypair.ts";

const DECIMALS = 1e6

const connection = new Connection(DEVNETQUICKNODE, "confirmed")

const payer = loadKeypair("/home/liujianyu/.config/solana/id.json")
const payerPublicKey = payer.publicKey

// 接收方地址和代币的 mint 地址
const receiverPublicKey = new PublicKey('GYLdtQ6MpGq6qeDqtjUFDLZaeqybz3ceHDezyHQp523A');    // 替换为接收方的公钥
const tokenAddress = new PublicKey(USDC_DEVNET_ADDRESS)                                     // USDC

const amount = 1 * DECIMALS;                                                                // 转账数量（以最小单位表示）


async function sendSplToken() {
    try {
        // 获取发送方和接收方的关联账户地址
        // 在 Solana 的 SPL Token 标准中，代币不是直接存储在用户的主账户（也称为 Solana 钱包地址）中，而是存储在专门的代币账户中。
        // getAssociatedTokenAddress 是用来计算用户对于某种特定 SPL Token 的关联账户地址的工具函数。
        const payerTokenAddress: PublicKey = await getAssociatedTokenAddress(tokenAddress, payerPublicKey)
        const receiverTokenAddress: PublicKey = await getAssociatedTokenAddress(tokenAddress, receiverPublicKey)

        console.log("payer Token Address:", payerTokenAddress.toBase58());
        console.log("receiver Token Address:", receiverTokenAddress.toBase58());

        // 检查接收方的关联账户是否存在
        const recipientAccountInfo = await connection.getAccountInfo(receiverTokenAddress)

        // 如果不存在，添加创建关联账户的指令
        const transaction = new Transaction();

        if (!recipientAccountInfo) {
            console.log("Recipient token account does not exist. Creating...");

            transaction.add(
                createAssociatedTokenAccountInstruction(
                    payerPublicKey,                         // 付款人
                    receiverTokenAddress,                   // 要创建的 token 账户
                    receiverPublicKey,                      // 接收方
                    tokenAddress                            // SPL Token 的 mint 地址
                )
            );
        }

        // Step 4: 添加转账指令
        transaction.add(
            createTransferInstruction(
                payerTokenAddress,                          // 发送方的 token 账户
                receiverTokenAddress,                       // 接收方的 token 账户
                payerPublicKey,                             // 授权人
                amount                                      // 转账金额
            )
        );

        const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);            // 签名并发送交易
        console.log("Transaction successful! Signature:", signature);
    } catch (error) {
        console.error("Transaction failed:", error);
    }
}

// 调用函数
sendSplToken();
