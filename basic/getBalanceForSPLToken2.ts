import { Connection, PublicKey } from '@solana/web3.js'

// @ts-ignore
import { getAccount, Account } from '@solana/spl-token';
import { DEVNETQUICKNODE, USDC_DEVNET_ADDRESS } from '../client/constants';


async function main() {
    try {
        const accountAddress = "96NjZXgj5xx72miy6Vqaqo6KtLfnvwEiEXoaN83f8NAm";              // 账户地址

        const accountPublicKey = new PublicKey(accountAddress);                                      // 将字符串转换为 PublicKey 类型
        const tokenMintPublicKey = new PublicKey(USDC_DEVNET_ADDRESS);
        
        const connection = new Connection(DEVNETQUICKNODE, "confirmed")

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
