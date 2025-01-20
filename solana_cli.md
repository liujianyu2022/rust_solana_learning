Solana CLI 是一个命令行界面工具，提供了一系列用于与 Solana Cluster 交互的命令。

## Solana CLI 配置
```shell
solana config get

    ● Config File       Solana CLI 文件在计算机上的位置
    ● RPC URL           你使用的节点，将你连接到 localhost、Devnet 或 Mainnet
    ● WebSocket URL     用于监听你所针对的 Cluster 事件的 WebSocket（在设置 RPC URL 时计算）
    ● Keypair Path      运行 Solana CLI 子命令时使用的密钥对路径
    ● Commitment        提供网络确认（confirmation）的度量，并描述区块在某一时刻已最终确认（finalized）的程度
```

最常见的更改将是针对的 Cluster。使用 solana config set --url 命令更改 RPC URL
**Pay Attention: if you can't connect with devnet or mainnet, you should use Alchemy RPC URL!!!!**
**Alchemy: https://dashboard.alchemy.com**
**Infura: https://developer.metamask.io**
It seems like that the solana rpc url doesn't exists in Infura
```shell
solana config set --url localhost 
solana config set --url devnet 
solana config set --url mainnet-beta

#----------------------------------------

solana config set --url http://127.0.0.1:8899
solana config set --url https://api.mainnet-beta.solana.com
solana config set --url https://api.devnet.solana.com
solana config set --url https://api.testnet.solana.com

#-----------------------------------------

solana config set --url https://solana-devnet.g.alchemy.com/v2/RSCz8A0CdM9zaYsSOuxYy9Hb630YE5Pa

```

可以使用 solana config set --keypair 命令更改 Keypair Path。然后，当运行命令时，Solana CLI 将使用指定路径上的密钥对
```shell
solana-keygen new --outfile \~/\<FILE_PATH>             # 生成新的密钥对，后跟存储密钥对的文件路径
solana config set --keypair ~/<FILE_PATH>               # 更改 Keypair Path, Solana CLI 将使用指定路径上的密钥对
```

## 本地 Solana 节点
```shell
solana-test-validator                                   # 启动本地 Solana 节点
solana config set --url http://127.0.0.1:8899           # 配置 Solana CLI 指向本地节点
solana balance                                          # 500000000 SOL
```
● 此命令会启动一个本地开发节点。默认情况下，它会创建一个完全隔离的环境，内置一些初始账户和测试代币，适合进行开发和测试。默认端口是 8899。
● 启动本地节点后，CLI 默认不会连接到你的本地节点。需要将 CLI 的 RPC URL 配置为本地节点地址

数据存储在临时目录中，节点关闭时会自动清除。如果你希望指定数据目录以保留区块链状态，可以使用：
```shell
solana-test-validator --ledger /path/to/ledger-directory
```

## 创建新项目
```shell
cargo new --lib hello_rust                              # 创建一个 rust项目
```

在 cargo.toml 中引入如下库, 这里solana的版本最好和你安装的solana版本一致，不然可能会报错

```
[package]
name = "rust_solana_learning"
version = "0.1.0"
edition = "2021"

[dependencies]
solana-program = "=2.0.21"              # 在 Cargo.toml 中使用 = 固定依赖版本，加上 = 后，Cargo 将强制安装指定版本，而不会解析到兼容的更高版本。

[dev-dependencies]
solana-program-test = "=2.0.21"         # 由于rustc 为1.78.0版本，和现在默认的最新版本solana-program不兼容，因此强制安装为兼容版本
solana-sdk = "=2.0.21"

[lib]
crate-type = ["cdylib", "lib"]
```
在 src 文件夹中编写程序

## 构建和部署
```shell
cargo build-bpf                                             # 构建 Solana 程序
solana program deploy <PATH>                                # 部署程序
solana program show <program_id>                            # 查看已部署程序的详细信息
solana transaction-history <WALLET_ADDRESS>                 # 列出与钱包地址相关的交易，寻找部署交易记录


# --- 下面是部署到本地节点的例子，本地节点启动后，solana balance 为 500000000 SOL ---
liujianyu@ubuntu:~/vscode/rust_solana_learning$ cargo build-bpf
    Finished release [optimized] target(s) in 0.36s

liujianyu@ubuntu:~/vscode/rust_solana_learning$ solana balance
    500000000 SOL

liujianyu@ubuntu:~/vscode/rust_solana_learning$ solana program deploy target/deploy/rust_solana_learning.so 
    Program Id: 3pS2nWKC8XQZfPRmqTAApRtBzyyXEA7qYVsV856G8rqZ
    Signature: 2BFssDMYYKe4t9eoG6SSVzr3ER6Dci7Cw5hrfnQoG9omaNqbE5vqqntCxg9ah858g8mdjNqJYDaKcfeR2qPk8T2b

liujianyu@ubuntu:~/vscode/rust_solana_learning$ solana balance
    499999999.863574803 SOL

liujianyu@ubuntu:~/vscode/rust_solana_learning$ solana program show 3pS2nWKC8XQZfPRmqTAApRtBzyyXEA7qYVsV856G8rqZ
    Program Id: 3pS2nWKC8XQZfPRmqTAApRtBzyyXEA7qYVsV856G8rqZ
    Owner: BPFLoaderUpgradeab1e11111111111111111111111
    ProgramData Address: 8aGjn13AmCPnHJ7pFqjdPJ7iACixtiRwj1YdXD7t6rjf
    Authority: 96NjZXgj5xx72miy6Vqaqo6KtLfnvwEiEXoaN83f8NAm
    Last Deployed In Slot: 36942
    Data Length: 45856 (0xb320) bytes
    Balance: 0.32036184 SOL
```
