import { Connection, PublicKey } from "@solana/web3.js";
import { ACCOUNT_ADDRESS_1, DEVNET_QUICK_NODE, LOCALHOST } from "../client/constants";

// PublicKey 表示账户的公钥。使用 new PublicKey() 是为了确保输入的字符串或数据被正确解析并转换为 Solana 公钥格式。
// Solana SDK 的许多函数（如 getBalance、sendTransaction 等）需要接收一个 PublicKey 对象，而不是普通字符串。

async function main() {
  try {

    const address = new PublicKey(ACCOUNT_ADDRESS_1)                                 // 将字符串转换为 PublicKey 类型

    const connection = new Connection(DEVNET_QUICK_NODE, "confirmed")
    const balance = await connection.getBalance(address)
    console.log(`Balance on devnet for account ${ACCOUNT_ADDRESS_1}: ${balance}`)

  } catch (error) {
    console.error("Failed to fetch balance:", error);
  }
}

main()

