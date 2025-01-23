import { Connection, PublicKey } from "@solana/web3.js";
import { ACCOUNT_ADDRESS_1, DEVNET_QUICK_NODE, USDC_DEVNET_ADDRESS } from "../client/constants";

async function main() {
    try {

        const address = new PublicKey(ACCOUNT_ADDRESS_1);                                      // 将字符串转换为 PublicKey 类型
        const tokenMint = new PublicKey(USDC_DEVNET_ADDRESS);

        const connection = new Connection(DEVNET_QUICK_NODE, "confirmed");

        // 获取 SPL Token 的余额
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(address, {
            mint: tokenMint,
        })

        tokenAccounts.value.forEach((tokenAccountInfo) => {
            console.log("tokenAccountInfo.account.data.parsed.info = ", tokenAccountInfo.account.data.parsed.info)
            const tokenAmount = tokenAccountInfo.account.data.parsed.info.tokenAmount.uiAmount;
            console.log(`SPL Token balance: ${tokenAmount}`);
        });

    } catch (error) {
        console.error("Failed to fetch balance:", error);
    }
}

main()