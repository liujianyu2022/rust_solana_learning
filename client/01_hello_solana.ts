import { Connection, PublicKey, Keypair, Transaction, TransactionInstruction, sendAndConfirmTransaction, } from "@solana/web3.js";
import * as fs from 'fs';
import { LOCALHOST } from "./constants";

// 读取本地账户的密钥对
function loadKeypair(path: string): Keypair {
    const keyData = JSON.parse(
        fs.readFileSync(path, 'utf-8')
    )
    return Keypair.fromSecretKey(Uint8Array.from(keyData));
}

async function main() {
    const connection = new Connection(LOCALHOST, "confirmed")

    const programId = new PublicKey("GiqXJuMb5F3d4yqWQSonFbwrdwTrvWKiroys35zx5ike")             // 加载部署的程序 ID

    const payer = loadKeypair('/home/liujianyu/.config/solana/id.json')                         // 加载现有账户（payer）

    console.log(`Payer Account: ${payer.publicKey.toString()}`)

    const transaction = new Transaction().add(                                                  // 创建交易指令
        new TransactionInstruction({
            keys: [],                                                                           // 程序无需账户依赖时，可以传空数组
            programId,
            data: Buffer.from([]),                                                              // 没有额外的指令数据
        })
    )

    try {
        const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);    // 签名并发送交易

        const confirmedTransaction = await connection.getTransaction(signature, {               // 使用 getTransaction 检查日志
            // 指定客户端支持的最高交易版本。如果交易版本超过此值，方法可能返回 null，因为客户端无法解析。
            // 如果你的应用只支持旧版本交易（例如版本 0），可以设置为 0。设置为 null 或不设置时，表示支持所有交易版本
            maxSupportedTransactionVersion: 0,             
            commitment: 'confirmed',                                                            // 查询已确认的交易
        })

        const logs = confirmedTransaction?.meta?.logMessages

        console.log("--------------------- logs --------------------")

        if (logs) {
            console.log(logs.join('\n'));
        } else {
            console.log('No logs found.');
        }
        
    } catch (error) {
        console.error('Transaction failed:', error);
    }
}

main()