在 Solana 中，一切都是账号（Everything is an Account），这与 Linux 系统将所有资源抽象为 "文件" 非常相似。
作为一个分布式区块链系统，Solana 将所有信息存储在账号 Account 对象中。

## 数据结构
```rust
pub struct Account {
    
    pub lamports: u64,                 // lamports in the account
    
    #[serde(with = "serde_bytes")]          
    pub data: Vec,                     // data held in this account
   
    pub owner: Pubkey,                 // the program that owns this account. If executable, the program that loads this account.
    
    pub executable: bool,              // this account's data contains a loaded program (and is now read-only)
    
    pub rent_epoch: Epoch,             // the epoch at which this account will next owe rent
}
```
1. lamports 字段表示账户中持有的 lamports 数量（Solana 中最小的货币单位）
2. data 字段存储与账户关联的数据。它以字节向量（Vec<u8>）的形式表示，允许存储任意类型的数据在账户中。
3. owner 字段指定了拥有或管理此账户的程序的公钥。如果账户是可执行的，那么这个程序可以加载到该账户中
4. executable 段表示账户是否可执行。如果设置为true，表示账户包含一个已加载的程序，且现在为只读状态
5. rent_epoch 字段指定了此账户下次需要缴纳租金的时期。在 Solana 中，账户必须支付租金才能继续留在区块链上，这个字段跟踪了下次租金支付的时间。


## 密钥对
在 Solana 中，使用 Ed25519 算法来生成 密钥对。数据签名也都使用 Ed25519 算法，而比特币、以太坊则使用椭圆曲线算法 ECC 。
由于公钥是二进制的，为了具有可读性，就对其进行了 Base58 编码，从而形成了账号的地址。
例如：HawRVHh7t4d3H3bitWHFt25WhhoDmbJMCfWdESQQoYEy

## 账号和公钥的关系

在 Solana 中，每个账号都有一个对应的公钥作为标识，这个公钥决定了谁有权对这个账号进行操作, Account 结构中的 owner 字段存储着这个账号的所有者公钥。

在进行交易时，由公钥来确定需要操作的账号，通过公钥找到对应的账号结构 Account，然后对账号进行操作，比如转账、更新数据等。



在Solana中有三类账户：

1. 数据账户，用来存储数据
    ● 系统所有账户（也就是我们自己用的账户）
    ● 程序派生账户（PDA）（基于自己账户派生出的新账户）
2. 程序账户，用来存储可执行程序（程序编译后会自动生成）
3. 原生账户，指Solana上的原生程序，例如"System"，"Stake"，以及"Vote"。


