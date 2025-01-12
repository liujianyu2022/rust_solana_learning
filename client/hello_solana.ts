import {
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
} from '@solana/web3.js';

import { DEVNET } from "./constants"

const connection = new Connection(DEVNET, 'confirmed')          // 连接到 Solana 测试网

const sender = Keypair.generate()                               // 创建一个新的 Keypair（用于发送交易）

