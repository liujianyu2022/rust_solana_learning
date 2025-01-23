import { Connection, PublicKey } from '@solana/web3.js'

// @ts-ignore
import { getAccount, Account } from '@solana/spl-token';
import { ACCOUNT_ADDRESS_1, DEVNET_QUICK_NODE, USDC_DEVNET_ADDRESS } from '../client/constants';


async function main() {
    try {

        const accountPublicKey = new PublicKey(ACCOUNT_ADDRESS_1);                                      // 将字符串转换为 PublicKey 类型
        const tokenMintPublicKey = new PublicKey(USDC_DEVNET_ADDRESS);
        
        const connection = new Connection(DEVNET_QUICK_NODE, "confirmed")

        // 获取用户与指定 Token Mint 相关的账户
        const tokenAccounts = await connection.getTokenAccountsByOwner(accountPublicKey, {
            mint: tokenMintPublicKey,
        })

        if (tokenAccounts.value.length === 0) {
            console.log('未找到与该 Token Mint 关联的 Token 账户');
            return
        }

        // 通常用户只会有一个与该 Token Mint 相关的账户，取第一个即可
        const tokenAccountPubkey = tokenAccounts.value[0].pubkey;


        // 获取 Token 账户的详细信息
        const tokenAccount: Account = await getAccount(connection, tokenAccountPubkey);

        console.log("tokenAccount = ", tokenAccount)

        // 返回 Token 账户余额（BigInt 转为字符串）
        let amount = tokenAccount.amount.toString();
        
        console.log("amount = ", amount)
    } catch (error) {
        console.error('获取余额失败:', error);

    }
}

main()
