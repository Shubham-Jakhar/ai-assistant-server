import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import {Groq} from 'groq-sdk';
import 'dotenv/config';
import system_prompt from './systemPromptTxt.js';

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
}))
app.use(express.json());
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.send("api working");
})
app.post('/api/ask-ai-assistant',async (req,res)=>{
        const askLLM = async (userPrompt) =>{
            const groq  = new Groq({api_key:process.env.GROQ_API_KEY});
            const model = "openai/gpt-oss-20b";
            let messages = [
                {
                    "role":"system",
                    "content":system_prompt
                },
                {
                    "role":"user",
                    "content":userPrompt
                }
            ]
            const response = await groq.chat.completions.create({model:model,messages:messages});
            const data =  response.choices[0]?.message?.content;
            if(!data) return "Unexpected error,reload the page and try after some time";
            return data; 
        }
        try{
            const userPrompt = req.body.data;
            const data = await askLLM(userPrompt);
            res.status(200).send({data});
        }catch(err){
        res.status(500).send({"error":err});
        } 
});


app.listen(3000, () => {
    console.log("server is running on port 3000");
})

