Solana 网络上存储的所有数据都包含在所谓的帐户中。每个帐户都有自己唯一的地址，用于识别和访问帐户数据。
Solana 程序只是一种特定类型的 Solana 帐户，用于存储和执行指令

## Solana crate solana_program
要使用 Rust 编写 Solana 程序，需要用到 Solana 程序的标准库 solana_program。该标准库包含我们将用于开发 Solana 程序的模块和宏。

## Solana 程序入口点
Solana 程序需要单个入口点来处理程序指令。入口点是使用 entrypoint! 声明的宏。

```rust
use solana_program::{
    account_info::AccountInfo,          // 一个结构体，允许我们访问帐户信息
    entrypoint,                         // 声明程序入口点的宏，类似于 Rust 中的 main 函数
    entrypoint::ProgramResult,          // 返回值类型
    pubkey::Pubkey,                     // 一个结构体，允许我们将地址作为公钥访问
    msg                                 // 一个允许我们将消息打印到程序日志的宏，类似于 Rust 中的 println宏。
};


entrypoint!(process_instruction);       // 声明程序入口点函数

fn process_instruction(
    program_id: &Pubkey,                // 当前的程序ID
    accounts: &[AccountInfo],           // 该指令涉及到的账户集合
    instruction_data: &[u8],            // 该指令的参数
) -> ProgramResult{
    // do something
	Ok(())
}
```



