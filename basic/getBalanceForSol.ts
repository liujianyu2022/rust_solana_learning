import { Connection, PublicKey } from "@solana/web3.js";
import { DEVNETALCHEMY, DEVNETQUICKNODE, LOCALHOST } from "../client/constants";

// PublicKey 表示账户的公钥。使用 new PublicKey() 是为了确保输入的字符串或数据被正确解析并转换为 Solana 公钥格式。
// Solana SDK 的许多函数（如 getBalance、sendTransaction 等）需要接收一个 PublicKey 对象，而不是普通字符串。

async function main() {
  try {

    const accountAddress = "96NjZXgj5xx72miy6Vqaqo6KtLfnvwEiEXoaN83f8NAm"
    const address = new PublicKey(accountAddress)                                 // 将字符串转换为 PublicKey 类型

    const connection1 = new Connection(LOCALHOST, "confirmed")
    const balance1 = await connection1.getBalance(address)
    console.log(`Balance on localhost for account ${accountAddress}: ${balance1}`)

    console.log("---------------------------------")
    
    const connection2 = new Connection(DEVNETQUICKNODE, "confirmed")
    const balance2 = await connection2.getBalance(address)
    console.log(`Balance on devnet for account ${accountAddress}: ${balance2}`)

  } catch (error) {
    console.error("Failed to fetch balance:", error);
  }
}

main()

