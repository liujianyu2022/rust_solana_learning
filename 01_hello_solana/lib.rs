use solana_program::{                           // solana_program: Solana 的 Rust SDK 提供了开发智能程序所需的核心模块。
    account_info::AccountInfo,                  // 一个结构体，包含账户的相关信息（如余额、地址等）
    entrypoint,                                 // 程序入口点的宏
    entrypoint::ProgramResult,                  // 程序函数的返回类型，表示执行成功或失败
    msg,                                        // 用于在 Solana 程序中记录日志信息。
    pubkey::Pubkey,                             // 公钥（Pubkey）是 Solana 的基本标识符，用于标识账户、程序等
};

entrypoint!(process_instruction);               // 定义智能程序的入口点函数

fn process_instruction(
    _program_id: &Pubkey,                       // 智能程序的公钥，如果该参数没有使用，那么可以在参数前面加上_
    _accounts: &[AccountInfo],                  // 一个包含所有相关账户信息的数组
    _instruction_data: &[u8],                   // 包含指令数据的字节数组
) -> ProgramResult {
    msg!("Hello, Solana!");
    Ok(())
}



