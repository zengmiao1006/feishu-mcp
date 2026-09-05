import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import axios from "axios";


const FEISHU_API = "https://open.feishu.cn";


async function getToken(){

    const res = await axios.post(
        `${FEISHU_API}/open-apis/auth/v3/tenant_access_token/internal`,
        {
            app_id: process.env.FEISHU_APP_ID,
            app_secret: process.env.FEISHU_APP_SECRET
        }
    );

    return res.data.tenant_access_token;
}


const server = new Server(
{
    name:"feishu-mcp",
    version:"1.0.0"
},
{
    capabilities:{
        tools:{}
    }
});


server.setRequestHandler(
    "tools/list",
    async ()=>{
        return {
            tools:[
                {
                    name:"feishu_test",
                    description:"测试飞书连接",
                    inputSchema:{
                        type:"object",
                        properties:{}
                    }
                }
            ]
        }
    }
);


server.setRequestHandler(
    "tools/call",
    async(req)=>{

        if(req.params.name==="feishu_test"){

            const token = await getToken();

            return {
                content:[
                    {
                        type:"text",
                        text:"飞书连接成功 Token:"+token.substring(0,10)+"..."
                    }
                ]
            }
        }

    }
);


const transport = new StdioServerTransport();

await server.connect(transport);
