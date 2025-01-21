import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
  TransactionInstruction,
  SystemProgram,
} from "@solana/web3.js";
import { serialize, deserialize } from "borsh"
import * as fs from "fs";
import { LOCALHOST } from "./constants";


// CounterAccount 对象
class CounterAccount {
  count = 0;
  constructor(fields: { count: number } | undefined = undefined) {
    if (fields) {
      this.count = fields.count;
    }
  }
}

// CounterAccount 对象 schema 定义
const CounterAccountSchema = new Map([
  [CounterAccount, { kind: "struct", fields: [["count", "u32"]] }],
]);

const PROGRAM_ID = new PublicKey("Co3VUNzbadyHtHGSkm1N7GrdWWedu8S433tn1sYAAbpP")    // 部署在 Solana 网络上的程序的公钥
const connection = new Connection(LOCALHOST, "confirmed");

// 读取本地账户的密钥对
function loadKeypair(path: string): Keypair {
  const keyData = JSON.parse(fs.readFileSync(path, "utf-8"));
  return Keypair.fromSecretKey(Uint8Array.from(keyData));
}

const payer = loadKeypair("/home/liujianyu/.config/solana/id.json")


const main = async () => {

  // 创建数据账户
  const counterAccount = Keypair.generate();                                      // 生成一个新的密钥对
  const space = 4;                                                                // CounterAccount 的存储空间大小 (u32 为 4 字节)
  const lamports = await connection.getMinimumBalanceForRentExemption(space);     // 获取避免账户被清除所需的最低租金

  const createAccountTx = new Transaction().add(
    SystemProgram.createAccount({
      fromPubkey: payer.publicKey,                                                // 支付租金的账户
      newAccountPubkey: counterAccount.publicKey,                                 // 要创建的账户的公钥
      lamports,                                                                   // 租金
      space,                                                                      // 账户的存储空间
      programId: PROGRAM_ID,
    })
  );

  await sendAndConfirmTransaction(connection, createAccountTx, [
    payer,
    counterAccount,
  ]);

  console.log(`Data account created: ${counterAccount.publicKey.toBase58()}`);

  // 构造指令
  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: counterAccount.publicKey,
        isSigner: false,
        isWritable: true,
      },
    ],
    programId: PROGRAM_ID,
  });

  // 创建交易
  const transaction = new Transaction();
  transaction.add(instruction);

  // 发送交易并确认
  const txHash = await sendAndConfirmTransaction(connection, transaction, [
    payer,
  ])

  console.log(`Transaction confirmed. TxHash: ${txHash}`);

  // 获取指定数据账户的信息
  const counterAccountInfo = await connection.getAccountInfo(
    counterAccount.publicKey
  )

  if (!counterAccountInfo || !counterAccountInfo.data) {
    throw new Error("Failed to fetch account info.");
  }

  // 反序列化数据
  const deserializedAccountData = deserialize(
    CounterAccountSchema,
    CounterAccount,
    counterAccountInfo.data
  )

  // @ts-ignore
  console.log("count =", deserializedAccountData.count);
}

main().catch((err) => {
  console.error(err);
})