
## 常见 SPL Token 指令码
在 Solana 的 SPL Token 程序中，每种操作都有一个固定的指令码（Instruction Code），用于标识特定的操作类型。
这些指令码是 SPL Token 程序（spl-token）的 ABI 规范的一部分。
以下是常见操作及其对应的指令码：

指令码	    操作名称	                描述
0	    InitializeMint	            初始化一个新的代币铸币账户（Mint Account），定义代币的发行量和精度。
1	    InitializeAccount	        初始化一个代币账户，用于持有代币。
2	    InitializeMultisig	        初始化一个多签账户。
3	    Transfer	                从一个账户向另一个账户转账代币。
4	    Approve	                    授权一个委托账户从持有者账户中花费一定数量的代币。
5	    Revoke	                    撤销对委托账户的授权。
6	    SetAuthority	            设置代币账户或铸币账户的权限（Owner 或 Close Authority）。
7	    MintTo	                    向指定账户铸造一定数量的代币（仅限铸币账户权限）。
8	    Burn	                    从一个账户销毁一定数量的代币。
9	    CloseAccount	            关闭一个代币账户，将其余额转回到指定账户。
10	    FreezeAccount	            冻结一个代币账户，使其不能转账代币（仅限冻结权限）。
11	    ThawAccount	                解冻一个被冻结的账户（仅限冻结权限）。
12	    TransferChecked	            安全的代币转账，带有额外的检查（例如验证代币的精度）。
13	    ApproveChecked	            安全的授权操作，带有额外的检查（例如验证代币的精度）。
14	    MintToChecked	            安全的铸造操作，带有额外的检查（例如验证代币的精度）。
15	    BurnChecked	                安全的销毁操作，带有额外的检查（例如验证代币的精度）。
16	    InitializeAccount2	        与 InitializeAccount 类似，但可以指定新的账户拥有者。
17	    SyncNative	                同步本地账户的 lamports 和代币余额。
18	    InitializeAccount3	        扩展了 InitializeAccount2，允许更多初始化选项。
19	    InitializeMint2	            与 InitializeMint 类似，但可以在不同上下文中使用。
20	    GetAccountDataSize	        获取代币账户所需的存储大小。
21	    InitializeImmutableOwner	初始化一个账户，使其所有者无法更改。
22	    AmountToUiAmount	        将代币数量转换为 UI 友好的格式（根据精度）。
23	    UiAmountToAmount	        将 UI 格式的代币数量转换为原始代币数量。