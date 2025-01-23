## installation

### Dependencies

```shell
1. sudo apt-get update
2. sudo apt-get install -y build-essential pkg-config libudev-dev llvm libclang-dev protobuf-compiler libssl-dev
```

如果报错：

下列软件包有未满足的依赖关系：
libudev-dev : 依赖: libudev1 (= 249.11-0ubuntu3.7) 但是 249.11-0ubuntu3.12 正要被安装
E: 无法修正错误，因为您要求某些软件包保持现状，就是它们破坏了软件包间的依赖关系。

那么直接把 libudev-dev 这个移除即可。

在下面的安装过程中，推荐指定版本安装，以免不必要的麻烦。版本汇总：
```shell
liujianyu@Ubuntu:~/vscode$ rustc --version
  rustc 1.78.0 (9b00956e5 2024-04-29)

liujianyu@Ubuntu:~/vscode$ cargo --version
  cargo 1.78.0 (54d8815d0 2024-03-26)

liujianyu@Ubuntu:~/vscode$ solana --version
  solana-cli 2.0.21 (src:99ac0105; feat:607245837, client:Agave)

liujianyu@Ubuntu:~/vscode$ avm --version
  avm 0.30.0

liujianyu@Ubuntu:~/vscode$ anchor --version
  anchor-cli 0.30.1
```

### RUST

```shell
1. curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
1. curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain 1.78.0   # 安装指定版本
2. . "$HOME/.cargo/env"
3. rustc --version
```

### SOLANA CLI

```shell
1. sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
1. sh -c "$(curl -sSfL https://release.anza.xyz/v2.0.21/install)"   # 安装指定版本
2. export PATH="/home/liujianyu/.local/share/solana/install/active_release/bin:$PATH"
3. solana --version
```

### ANCHOR CLI

```shell
1. cargo install --git https://github.com/coral-xyz/anchor avm --force
1. cargo install --git https://github.com/coral-xyz/anchor avm --tag v0.30.0 --force  # 安装指定版本

2. avm --version

3. avm install latest         
3. avm install 0.30.1         # 安装指定版本
4. avm use latest             # avm use 0.30.1

5. anchor --version
```

## config

```shell
liujianyu@Ubuntu:~$ solana config get
  Config File: /home/liujianyu/.config/solana/cli/config.yml
  RPC URL: https://api.mainnet-beta.solana.com                           # 主网URL
  WebSocket URL: wss://api.mainnet-beta.solana.com/ (computed)
  Keypair Path: /home/liujianyu/.config/solana/id.json 
  Commitment: confirmed 
```

设置测试网的URL

```shell
liujianyu@Ubuntu:~$ solana config set --url https://api.devnet.solana.com
  Config File: /home/liujianyu/.config/solana/cli/config.yml
  RPC URL: https://api.devnet.solana.com                                        # 测试网URL
  WebSocket URL: wss://api.devnet.solana.com/ (computed)
  Keypair Path: /home/liujianyu/.config/solana/id.json 
  Commitment: confirmed 
```

## basic command

### 生成测试钱包

```shell
liujianyu@Ubuntu:~$ solana address
  Error: No default signer found, run "solana-keygen new -o /home/liujianyu/.config/solana/id.json" to create a new one

liujianyu@Ubuntu:~$ solana-keygen new -o /home/liujianyu/.config/solana/id.json
  Wrote new keypair to /home/liujianyu/.config/solana/id.json
  ==============================================================================
  pubkey: 96NjZXgj5xx72miy6Vqaqo6KtLfnvwEiEXoaN83f8NAm
  ==============================================================================
  Save this seed phrase and your BIP39 passphrase to recover your new keypair:
  east ribbon fame guide begin kidney relax shoulder nothing step program peanut
  ==============================================================================
```

### 测试钱包

```shell
liujianyu@Ubuntu:~$ solana address
  96NjZXgj5xx72miy6Vqaqo6KtLfnvwEiEXoaN83f8NAm

liujianyu@Ubuntu:~$ solana balance
  0 SOL
```

If you can't get balance because of the error as follow:

```shell
liujianyu@Ubuntu:~$ solana balance
  Error: error sending request for url (https://api.devnet.solana.com/): error trying to connect: tcp connect error: Connection refused (os error 111)
```

It seems like that you don't set the proxy correctly. Then you can do as follow:

```shell
env | grep -i proxy
```

run this command at linux system terminal and vscode terminal respectively, and you would be able to find some differences.
```shell
# in linux terminal, it has set the proxy
liujianyu@ubuntu:~$ env | grep -i proxy
  no_proxy=localhost,127.0.0.0/8,::1
  https_proxy=http://127.0.0.1:7890/
  NO_PROXY=localhost,127.0.0.0/8,::1
  HTTPS_PROXY=http://127.0.0.1:7890/
  HTTP_PROXY=http://127.0.0.1:7890/
  http_proxy=http://127.0.0.1:7890/
  ALL_PROXY=socks://127.0.0.1:7891/
  all_proxy=socks://127.0.0.1:7891/

# in vscode terminal, it doesn't set proxy
liujianyu@ubuntu:~/vscode/rust_solana_learning$ env | grep -i proxy
liujianyu@ubuntu:~/vscode/rust_solana_learning$ 
```
Then you should set the proxy for vscode, just add the **'terminal.integrated.env.linux'** part into the **settings.json** 
```json
{
    "git.autofetch": true,
    "files.autoSave": "afterDelay",
    "rust-analyzer.workspace.discoverConfig": null,
    "terminal.integrated.env.linux": {
        "http_proxy": "http://127.0.0.1:7890/",
        "https_proxy": "http://127.0.0.1:7890/",
        "all_proxy": "socks://127.0.0.1:7891/",
        "no_proxy": "localhost,127.0.0.1,::1"
    }
}
```

It works now
```shell
# in vscode terminal, it has set the proxy
liujianyu@ubuntu:~/vscode/rust_solana_learning$ env | grep -i proxy
  no_proxy=localhost,127.0.0.1,::1
  https_proxy=http://127.0.0.1:7890/
  http_proxy=http://127.0.0.1:7890/
  all_proxy=socks://127.0.0.1:7891/

liujianyu@ubuntu:~/vscode/rust_solana_learning$ solana balance
  4.7298624 SOL
```

### 领取水龙头
```
https://faucet.solana.com             # for sol
https://spl-token-faucet.com/         # for spl token
```

```shell
liujianyu@Ubuntu:~$ solana balance
  5 SOL
```

## 区块链浏览器
https://explorer.solana.com/
https://solscan.io/


## TEST ACCOUNT
grocery catalog wreck million staff victory trust antique live fine yard twelve

