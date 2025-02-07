const { default: makeWASocket, DisconnectReason, useMultiFileAuthState, browsers } = require("@whiskeysockets/baileys")
const pino = require("pino")
const chalk = require("chalk").default;
const readline = require("readline")
const figlet = require("figlet")
const handleCommand = require("./case")
const { password } = require("./kenz")
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


const useCODE = process.argv.includes("--useCODE")
console.log(useCODE)

function askPassword() {
    rl.question("🔑 Masukkan Password: ", (input) => {
        if (input === password) {
            console.log("✅ Password benar! Bot sedang berjalan...");
            rl.close();
            startBot(); // Panggil fungsi bot
        } else {
            console.log("❌ Password salah! Coba lagi.\n");
            askPassword(); // Ulangi input password jika salah
        }
    });
}

console.log(chalk.blue(figlet.textSync("kenz", { font: "Ghost" })));

console.log(chalk.bgRed(" • KENZ MARKET\n • DILARANG RESELL!! "))

console.warn(chalk.red("\n(node:38) [DEP0040] DeprecationWarning: The `punycode` module is deprecated."));

console.log(`TERIMA KASIH TELAH MENGGUNAKAN SCRIPT BY KENZ MARKET`.green.bold)
console.log(`▄▀▄ █▄░▄█ █▀▄ ▄▀▄ █░░ █▀ ▄▀▄
█▀█ █░█░█ █▀█ █▀█ █░░ █▀ █░█
▀░▀ ▀░░░▀ ▀▀░ ▀░▀ ▀▀▀ ▀▀ ░▀░
▄░█░█░█ ▄█░
░▀█░█░█ ░█░
░░▀░░▀░ ▄█▄`.cyan.bold)

async function startBot(){
  const { state, saveCreds } = await useMultiFileAuthState("kenzdev")
  const kenz = makeWASocket({
    auth: state,
    printQRInTerminal: !useCODE,
    browser: useCODE ? ["Chrome (linux)", "", ""] : ["Kenzdev", "Firefox", "1.0.0"],
    logger: pino({ level: "silent" })
  })
  if(useCODE && !sock.authState.creds.registered) {
    const question = (pertanyaan) => new Promise((resolve) => {const readline = require("readline").createInterface({ input: process.stdin, output: process.stdout })
    readline.question(pertanyaan, (answer) => { resolve(answer)
    readline.close()
    })
    })
    const nomorwa = await question("Masukan Nomor Whatsapp Anda: +")
    setTimeout(async function () {
   const pairingCode = await kenz.requestPairingCode(nomorwa)
    console.log("pairing code Anda : ", pairingCode)
    }, 3000)
  }
  
  const channelJid = "120363376589165265@newsletter";

async function autoJoinChannel(kenz) {
    try {
        await kenz.groupParticipantsUpdate(channelJid, [global.NomorOwner], "add");
        console.log("✅ Bot berhasil join saluran WhatsApp!");
    } catch (err) {
        console.log("❌ Gagal join saluran WhatsApp!", err);
    }
}
  
  kenz.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect } = update
    if(connection === "close") {
      const shouldReconnect = lastDisconnect.error?.output.statusCode !== DisconnectReason.loggedOut;
      if(shouldReconnect) {
        console.log("Menjalankan Ulang")
        startBot();
      }
      if(connection === "open") {
        console.log("BOT SUDAH TERHUBUNG")
        kenz.sendMessage("6288215523477@s.whatsapp.net", {text: `*BOT AMBALEON V1.0 TERSAMBUNG ✅*
*SC BY ALZZOFFC*

CREDIT : ALZZOFFC 

*NOTE*
* TERIMAKASIH SUDAH MEMBELI SCRIPT BOT DI ALZZOFFC SEMOGA JADI LANGGANAN 😇

*SC VERSI NO ENC*`})
      }
    }
  })
  kenz.ev.on("creds.update", saveCreds)
  kenz.ev.on("messages.upsert", async (msg) => {
    const m = msg.messages[0];
    if (!m.message || !m.key.remoteJid) return;

    m.reply = async (text) => {
        await kenz.sendMessage(m.key.remoteJid, { text }, { quoted: m });
    };

    const sender = m.key.remoteJid;
    const from = m.key.remoteJid;
    const text = m.message.conversation || m.message.extendedTextMessage?.text;

    if (!text || !text.startsWith(".")) return;

    const command = text.slice(1).trim().split(" ")[0];
    const textt = text.trim().split(" ").slice(1);
    const args = text.trim().split(" ").slice(1);

    const senderName = sender.replace(/@s.whatsapp.net/, "");
    const senderNumber = m.pushName || senderNumber;

    handleCommand(kenz, m, command, args, senderName, senderNumber, from, textt);
});


}

startBot()