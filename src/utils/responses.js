// Note: These are taken from https://github.com/NotAWeebDev/Misaki
// The bot has died but I really liked those responses and my own creativity is trash.
// TODO: Currently it's directly pasted from Misaki, modify a few things and remove ones we don't need.
// - Removed a few responses we don't need but still have to add a few more responses to feel a bit unique.

// Member Join
exports.welcomeMessages = [
  "O-ohayou gozaimasu **{{user}}-san**.",
  "Hmph, sepertinya **{{user}}**, orang konyol lainnnya, telah bergabung.",
  "Ini bukan seperti aku menyukaimu atau apapun... tapi selamat datang di server **{{user}}**.",
  "O-oh, selamat datang **{{user}}-san**. Aku harap, Aku tidak membuat kamu malu...",
  "OwO siapa ini? **{{user}}** telah bergabung dengan server.",
  "**{{user}}**, Sepertinya Kamu mendarat di sisi yang salah dari Discord!",
  "Hai **{{user}}**! Selamat Datang di **{{guild}}**, Aku harap Kamu betah disini!",
  "ERGH, kenapa **{{user}}** harus bergabung, Aku sudah harus menangani **{{amount}}** user!",
  "Y-yay! Lebih banyak orang untuk ditangani! Selamat datang **{{user}}**!",
  "Hai! Waifu/husbando **{{user}}** telah bergabung dengan Akademi!",
  "**{{user}}-san**, selamat datang di **{{guild}}**!"
];

// Member Leave
exports.goodbyeMessages = [
  "Awh, A-Aku tidak punya kata-kata untuk ini, ta-tapi, A-Aku akan merindukanmu **{{user}}-san**!",
  "Awh, **{{user}}** telah pergi... A-aku tidak peduli! Bodoh!",
  "**{{user}}-san**.... Ja-jangan...",
  "**{{user}}** telah pergi, begitu saja seperti kita tidak membutuhkannya atau apapun.",
  "**{{user}}** kenapa kamu meninggalkan aku di sini, sendirian!?",
  "**{{user}}** menemukan tombol keluar.",
  "Eep! **{{user}}** pergi?! Me-mereka selalu meninggalkanku, sialan itu...",
  "A-akhirnya..., aku kira **{{user}}** tidak akan pernah pergi dari sini!",
  "Woah! **{{user}}** meninggalkan **{{guild}}**! sialan, lalu kenapa mereka bergabung?!",
  "Woo, **{{user}}** telah pergi, sekarang aku hanya perlu menangani **{{amount}}** user!"
];

// Level Up
exports.levelUpMessages = [
  "Kamu telah menjadi level **{{level}}**, petani!",
  "YATTA! Kamu telah naik level, **{{user}}-san**! Level kamu sekarang **{{level}}**, i-itu bukan bermaksud apa-apa!",
  "E-eh? Kamu sudah naik level? well, jangan karena kamu sudah level **{{level}}** sekarang, bukan berarti aku akan lebih menyukaimu **{{user}}**... bodoh.",
  "Hmph, Kamu telah naik level **{{level}}**, **{{user}}-san**. W-well, tidak ada bedanya bagiku!",
  "Hyaa~! Kamu telah naik level**{{user}}-san**, level kamu sekarang **{{level}}**.",
  "**{{user}}**, sialan. Jangan tinggalkan aku karena kamu sudah level **{{level}}**.",
  "**{{user}}-san**, jangan lupakan aku! Hanya karena kamu sudah level **{{level}}**",
  "Pfft, Kamu baru saja menjadi level **{{level}}**, Ayo cepat **{{user}}**.",
  "Wah gila, **{{user}}** semakin pintar sekarang dengan I.Q. **{{level}}**",
  "A-apa? Kamu sudah mencapai level **{{level}}** cepat sekali...",
  "Kamu baru naik level **{{level}}**? Kamu membuat aku jijik!!",
  "Bagaimana mungkin Kamu bisa menjadi level **{{level}}** Ka-kamu sialan!",
  "Si-sialan! Kamu sudah mencapai level **{{level}}**, sekarang kamu bebas! D-dummy...",
  "Kamu sudah level **{{level}}**, sial!",
];

// Commands
exports.pingMessages = [
  "Ugh, lagi? Kamu selalu bertanya, dan aku selalu memberi tahu kamu bahwa aku merespon **{{ms}}ms**.",
  "Bo-bodoh, Aku mendengarnya... baru saja masuk **{{ms}}ms**.",
  "I-ini dia, Aku merespon **{{ms}}ms**.",
  "Ini dia, bukankah itu sepadan dengan waktuku. Aku hanya butuh **{{ms}}ms**.",
  "Apakah ini benar? Aku merespon **{{ms}}ms**.",
  "**{{user}}**? aku telah merespon **{{ms}}ms**.",
  "**{{user}}**! Kamu sudah menyia-nyiakan **{{ms}}ms** waktuku, ERGH",
  "A-apakah aku melakukannya dengan benar? Aku merespon **{{ms}}ms**.",
  "**{{user}}**, ya aku di sini, dan itu membuatku **{{ms}}ms** untuk merespon!",
  "**{{user}}** kenapa kamu ping aku! Kamu sudah menyia-nyiakan **{{ms}}ms** waktuku!!",
  "hey **{{user}}**, itu membutuhkan **{{ms}}ms** untuk mengirim pesan ini",
  "Kamu sudah membuat aku **{{ms}}ms** lebih tua - hanya karena bertanya.",
  "**{{user}}** Aku sudah menerima pesan Kamu dan pesan itu diterima pada **{{ms}}ms**, aku tidak peduli.",
  "Tahukah Kamu berapa lama waktu yang aku butuhkan untuk membaca pesan itu? Kamu cukup banyak membuang **{{ms}}ms** hariku!",
  "Si-sialan! Pingku **{{ms}}ms**! Apa kamu senang sekarang?"
];

exports.dailySuccessMessages = [
  "Yatta! Kamu mendapatkan **{{amount}}**.",
  "Selamat, kamu sudah redeem hadiah harian **{{amount}}**!",
  "Akhirnya, Aku kira kamu tidak akan mengklaim **{{amount}}** milik kamu hari ini!",
  "Ayah kamu memberikan **{{amount}}**? Aku bisa mendapatkan lebih dari itu setiap jamnya!",
  "Kamu telah mengklaim hadiah harian Kamu **{{amount}}**, tidak begitu keren bukan?",
  "A-apa?! Kamu mendapatkan **{{amount}}**, woah...",
  "Kamu baru saja mendapatkan **{{amount}}**? Mungkin kamu bisa membelikanku makan malam kapan-kapan **{{user}}-san**? :wink:",
  "Ya ampun, akhirnya kamu mendapatkan keberuntunganmu juga, sebanyak **{{amount}}**. kamu hanya perlu bersabar, sekarang berikan aku Pocky."
];

exports.dailyFailureMessages = [
  "Kamu belum bisa mengklaim hadiah harian Kamu, silahkan coba lagi dalam **{{time}}**",
  "ah ayolah, Kamu belum bisa mendapatkannya sekarang.. Kamu bisa mendapatkan hadiah harian lagi dalam **{{time}}**",
  "**{{user}}-san**, Kamu sudah menerima uang saku Kamu hari ini. Kamu bisa mendapatkannya lagi dalam **{{time}}**",
  "Ini lagi? Aku sudah menyuruhmu untuk menunggu selama **{{time}}**",
  "Hey! Uang sudah menipis disini. tanyakan lagi dalam **{{time}}**",
  "Ka-kamu akan membuatku marah! **{{time}}** lagi untuk mengklaim!"
];

exports.balanceMessages = [
  "Pfft,**{{amount}}** sangat sedikit? Ayahku memberi aku uang jajan lebih banyak!",
  "Hanya **{{amount}}**? Itu tidak seberapa dibandingkan dengan uang dikantongku!",
  "**{{user}}-san**, kamu memiliki **{{amount}}**, tapi kamu tidak membutuhkan itu untuk membuatku bahagia.",
  "**{{user}}**, lagi? Ugh, kamu memiliki **{{amount}}**... Jeez, coba kamu catat. Mungkin kamu akan ingat..."
];

exports.otherBalanceMessages = [
  "Kenapa kamu ingin tahu saldo **{{user}}**? Masa bodoh, lagi pula saldonya hanya **{{amount}}**.",
  "A-apa? **saldo {{user}}-san**? **{{amount}}**..",
  "Kenapa Kamu begitu peduli dengan saldo **{{user}}**? lagi pula A-aku tidak peduli, dia memiliki saldo **{{amount}}**.",
  "Adakah alasan kenapa kamu ingin mengetahui saldo **{{user}}**? dia memiliki saldo **{{amount}}**.",
  "Hm, tunggu sebentar... dia memiliki saldo **{{amount}}**, tapi kenapa kamu ingin tahu saldo milik **{{user}}**?",
  "Kamu sudah bertanya mengenai saldo milik **{{user}}**, oh my god! Lagi pula, saldonya hanya **{{amount}}**."
];

exports.levelMessages = [
  "Level kamu **{{level}}**, Tidak buruk...",
  "Pfft, level **{{level}}**?",
  "**{{user}}** level kamu**{{level}}**?, payah",
  "**{{user}}**, Kamu menanyakan ini lagi? Masa bodoh, level kamu **{{level}}**.",
  "ini dia **{{user}}-san**, level kamu **{{level}}**.",
  "Level kamu **{{level}}**, mungkin jika kamu mau lebih aktif lagi, level kamu bisa lebih tinggi dari ini.",
  "Hanya level **{{level}}**? sepertinya aku lebih baik dari itu.",
  "Level **{{level}}**? Apa? kamu berharap lebih tinggi dari **{{level}}**?",
  "Hanya level **{{level}}**? Pfft! Aku sudah pernah melihat yang lebih baik dari itu."
];

exports.otherLevelMessages = [
  "Lain kali tanya saja sendiri pada **{{user}}**, tapi Aku akan memaafkanmu kali ini. ini dia levelnya: **{{level}}**.",
  "Kenapa kamu ingin tahu level **{{user}}**? Lagian level dia hanya **{{level}}**."
];

// System

// Reload
exports.reloadMissingArg = [
  "A-apa?! Aku tidak tahu harus berbuat apa, karena kamu tidak memberitahuku apa yang harus dilakukan!",
  "Bodoh! Kamu harus memberikan perintah untuk mereload!"
];

exports.reloadNotFound = [
  "Eeeh?! **{{user}}-san**, kenapa Kamu meminta aku untuk menemukan perintah yang tidak ada, bahkan itu bukan alias/singkatan.",
  "apa yang kamu lakukan? **{{command}}** tidak ada! Bodoh!"
];

exports.reloadErrUnload = [
  "**{{user}}-san**, Aku pikir Aku merusaknya... Ini yang terjadi: **{{response}}**",
  "ada kesalahan, mungkin itu salahmu! Bodoh! **{{response}}**"
];

exports.reloadErrLoad = [
  "Ugh, tidak bisakah kamu melakukan satu hal saja dengan benar? berakhir dengan kerusakan **{{command}}**.",
  "**{{command}}** rusak... Bukan salahku atau masalahku! (**{{response}}**)"
];

exports.reloadSuccess = [
  "Yatta! **{{command}}** dimuat ulang, sekarang kita bisa melakukan itu seperti sebelumnya, atau apapun yang ingin Kamu lakukan...",
  "Aku sudah memuat ulang **{{command}}**, bukan berarti aku bisa melihat kegunaannya..."
];

// After the following line is the end of Misaki code and are made by myself.

// Errors

exports.notNSFWChannel = [
  "Bodoh! Kamu pikir apa yang ingin kamu lakukan? Perintah itu hanya dapat digunakan di channel NSFW.",
  "A-apa? Apakah ini tempat yang benar untuk melakukan itu? Perintah itu hanya dapat digunakan di channel NSFW."
];

exports.guildOnlyCommand = [

];
