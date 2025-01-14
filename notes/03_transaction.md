在 Solana 区块链上，程序的执行开始于将交易提交到集群。交易就是链外数据和链上数据产生的一次交互。

每个交易包含一个或多个指令，Solana 的运行环境 Runtime 会将按顺序、原子性地处理交易中包含的每个指令。如果指令的任何部分失败，整个交易将失败。

## 交易结构
```rust

pub struct Message {                    // 交易的核心部分，包含了执行指令和相关账户信息

    pub header: MessageHeader,          // 交易头部，描述签名账户和只读账户的信息。标识哪些账户需要签名，哪些账户是只读的

    #[serde(with = "short_vec")]        // 使用 serde 的 short_vec 模块进行序列化和反序列化，这是一种高效的序列化格式
    pub account_keys: Vec,              // 包含交易中加载的所有账户的公钥列表

    pub recent_blockhash: Hash,         // 最近区块的哈希值，作为交易的一个时效性验证标志  确保交易在一个有效的时间窗口内提交，防止重放攻击。

    #[serde(with = "short_vec")]        // 使用 short_vec 进行序列化
    pub instructions: Vec,              // 包含一组执行的指令，每个指令会调用一个程序并执行对应的逻辑

    #[serde(with = "short_vec")]        // 使用 short_vec 进行序列化
    pub address_table_lookups: Vec,     // 定义了一组地址表查找项，允许从链上的地址表中动态加载额外的账户 提高了交易的可扩展性，可以通过地址表加载更多账户而不增加消息体积
}

pub enum VersionedMessage {             // 一个版本化的消息类型，允许支持不同的消息格式
    Legacy(LegacyMessage),              // 表示传统的非版本化消息格式
    V0(v0::Message),                    // 新的 V0 消息格式，增加了对地址表查找等功能的支持
}

pub struct VersionedTransaction {       // 表示完整的交易数据，包括签名和消息

    #[serde(with = "short_vec")]        // 使用 short_vec 进行序列化以提高效率
    pub signatures: Vec,                // 一个签名列表，签名对应于 message 中的 account_keys

    pub message: VersionedMessage,      // 消息部分，表示交易的主要内容     支持不同版本的消息（通过 VersionedMessage 枚举表示）
}
```

从中可以简单理解为，交易就是一连串的交易指令，以及需要签名的指令的签名内容。

## 交易指令
```rust
pub struct CompiledInstruction {

    pub program_id_index: u8,           // 指定将运行此指令的程序的账户（即程序的 program_id）, 通过索引引用账户而不是直接嵌入公钥，减少了存储和带宽开销

    #[serde(with = "short_vec")]
    pub accounts: Vec,                  // 一个有序的索引列表，每个索引指向 account_keys 中的账户, 定义该指令的上下文账户，包括输入账户、输出账户，以及权限检查所需的账户

    #[serde(with = "short_vec")]
    pub data: Vec,                      // 包含发送到程序的输入数据  传递执行此指令所需的参数
}
```

交易指令就是执行哪个合约(program_id_index)，输入为数据 data，执行过程中需要用到哪些 Account: accounts
类似函数调用一样，program_id_index是函数名，因为合约都是用地址标识的，所以这里指在accounts数组中的第几个地址
传入的参数包含两部分，二进制数据data和需要使用到的Account资源：accounts

```rust
account_keys = [                // 一个交易包含以下账户
    "UserAccount",
    "TokenAccountA",
    "TokenAccountB",
    "ProgramAccount",
]

CompiledInstruction {           // 一个指令
    program_id_index: 3,        // 指令将由 account_keys[3]，即 ProgramAccount 执行
    accounts: vec![0, 1, 2],    // 程序需要 UserAccount, TokenAccountA, 和 TokenAccountB 作为上下文
    data: vec![0x01, 0x64],     // 包含程序所需的参数
}
```
