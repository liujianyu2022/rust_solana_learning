## 程序帐户 & 数据帐户
Solana 程序帐户仅存储处理指令的逻辑。这意味着程序帐户是“只读”和“无状态”的。
程序处理指令所需的“状态”（数据集）存储在数据帐户中（与程序帐户分开）

## 数据账户的定义
我们的 Solana 程序要实现计数器的累加，那就必须先定义该数据是以何种形式存储在 Solana 链上的，这里我们使用结构体CounterAccount，之所以使用Account后缀，因为它是一个数据账户

```rust
use borsh::{BorshDeserialize, BorshSerialize};          // 需要（反）序列化操作，这里需要引入borsh库

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct CounterAccount {                             // 定义数据账户的结构
    pub count: u32,                                     // 在每次发起交易指令时，它都会+1操作
}
```

该结构体中定义了u32类型的count属性，在每次发起交易指令时，它都会+1操作。因为该值的存储和传输都是使用的字节码，要把字节码转为Rust 类型，我们还需要（反）序列化操作，这里需要引入borsh库。
实际进行（反）序列化操作是通过BorshSerialize、BorshDeserialize这2个派生宏实现的


```rust
pub fn process_instruction(
    program_id: &Pubkey,                // 程序ID，即程序地址
    accounts: &[AccountInfo],           // 该指令涉及到的账户集合
    _instruction_data: &[u8],           // 指令数据
) -> ProgramResult {
    msg!("Hello World Rust program entrypoint");

    let accounts_iter = &mut accounts.iter();                                       // 账户迭代器

    let account = next_account_info(accounts_iter)?;                                // 获取调用者账户

    if account.owner != program_id {                                                // 账户权限校验, 验证调用者身份
        msg!("Counter account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    // 读取并写入新值
    let mut counter = CounterAccount::try_from_slice(&account.data.borrow())?;      // 从 Solana 数据账户中反序列化出 CounterAccount 结构体的实例
    counter.count += 1;                                                             // 将CounterAccount结构体中的修改后的值递增
    counter.serialize(&mut *account.data.borrow_mut())?;                            // 将更新后的结构体序列化为字节数组，然后写入 Solana 账户的可变数据字段中

    Ok(())
}
```

## 修改数据账户
```rust
/*
1. &account.data：获取账户的数据字段的引用。  
   在 Solana 中，账户的数据字段data存储着与账户关联的实际数据，对于程序账户而言，它是程序的二进制内容，对于数据账户而言，它就是存储的数据。

2. borrow()：使用该方法获取data数据字段的可借用引用。
   并通过 &account.data.borrow() 方式得到账户数据字段的引用。

3. CounterAccount::try_from_slice(...)：调用try_from_slice方法，它是BorshDeserializetrait 的一个方法，用于从字节序列中反序列化出一个结构体的实例。

4. ?：是一个错误处理操作符，如果try_from_slice返回错误，整个表达式将提前返回，将错误传播给调用方。
*/

let mut counter = CounterAccount::try_from_slice(&account.data.borrow())?;

/*
1. &mut *account.data.borrow_mut()：通过borrow_mut()方法获取账户数据字段的可变引用，然后使用*解引用操作符获取该data字段的值，并通过&mut将其转换为可变引用。

2. serialize函数方法，它是BorshSerialize trait 的一个方法，用于将结构体序列化为字节数组。

3. ?：是一个错误处理操作符，如果serialize方法返回错误，整个表达式将提前返回，将错误传播给调用方。
*/

counter.serialize(&mut *account.data.borrow_mut())?;
```


