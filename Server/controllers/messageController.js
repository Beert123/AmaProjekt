import { loadMessages, saveMessages } from "../data/messages.js";

export async function getMessages(req, res) {
    const messages = await loadMessages();
    res.json(messages);
    return 0;
}

export async function createMessage(req, res) {
  const messages = await loadMessages();
  const question = req.body.question.trim();
  if(!question){
    res.json({error: "FEJL FEJL FEJL"});
    return;
  }
  const qmsg = {type: "question", text: question, createdAt: new Date().toISOString() }
  messages.push(qmsg);

  let answer = findBestAnswer(question);
  const answerMsg = {type: "answer", text: answer, createdAt: new Date().toISOString()}
  messages.push(answerMsg);

  await saveMessages(messages);

  res.json({question: qmsg, answer: answerMsg});
}

export async function deleteMessages(req,res){
    await saveMessages([]);
    res.send();
}