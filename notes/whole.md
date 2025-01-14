通过前面几节对程序的各个部分的分析，现在我们看下完整的计数器程序。完整的代码在右侧，它包含了我们之前讲到的：
● borsh 和 solana_program 依赖的引入
● 数据账户的定义
● 程序入口点函数的定义
● 程序的核心逻辑：指令处理函数

总的来说，在这个 Solana 实现的程序中，我们要自己实现（反）序列化、指定程序入口点、账号安全校验等操作，这对于程序的开发是必须的，但也是繁琐的
如果使用 Anchor 框架，就能把我们从这些重复的劳动中解脱出来，更加专注于程序本身的业务逻辑

```rust
use borsh::{BorshDeserialize, BorshSerialize};

use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};


#[derive(BorshSerialize, BorshDeserialize, Debug)]          // 定义数据账户的结构
pub struct CounterAccount {
    pub count: u32,
}

entrypoint!(process_instruction);                           // 定义程序入口点函数

pub fn process_instruction(
    program_id: &Pubkey,                                    // 程序ID，即程序地址
    accounts: &[AccountInfo],                               // 该指令涉及到的账户集合
    _instruction_data: &[u8],                               // 指令数据
) -> ProgramResult {
    msg!("Hello World Rust program entrypoint");

    let accounts_iter = &mut accounts.iter();               // 账户迭代器

    let account = next_account_info(accounts_iter)?;        // 获取调用者账户

    if account.owner != program_id {                                        // 验证调用者身份
        msg!("Counter account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    // 读取并写入新值
    let mut counter = CounterAccount::try_from_slice(&account.data.borrow())?;
    counter.count += 1;
    counter.serialize(&mut *account.data.borrow_mut())?;

    Ok(())
}
```