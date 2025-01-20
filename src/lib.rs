use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
};


#[derive(BorshSerialize, BorshDeserialize, Debug)]                                  // 定义数据账户的结构
pub struct CounterAccount {
    pub count: u32,
}

entrypoint!(process_instruction);                                                   // 定义程序入口点函数

pub fn process_instruction(
    program_id: &Pubkey,                                                            // 程序ID，即程序地址
    accounts: &[AccountInfo],                                                       // 该指令涉及到的账户集合
    _instruction_data: &[u8],                                                       // 指令数据
) -> ProgramResult {
    msg!("Hello World Rust program entrypoint");

    let accounts_iter = &mut accounts.iter();       // 账户迭代器
    
    let account = next_account_info(accounts_iter)?;              // 获取调用者账户

    if account.owner != program_id {                                                // 验证调用者身份
        msg!("Counter account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    // 读取并写入新值
    let mut counter = CounterAccount::try_from_slice(&account.data.borrow())?;

    msg!("previous count = {}", counter.count);

    counter.count += 1;
    counter.serialize(&mut *account.data.borrow_mut())?;
    
    msg!("after count = {}", counter.count);

    Ok(())
}