import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import axios from "axios";
import { z } from "zod";


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



const server = new McpServer({
    name:"feishu-mcp",
    version:"1.0.0"
});



// 获取 Base 信息
server.tool(
    "feishu_get_base",
    "获取飞书 Base 信息",
    {
        app_token:z.string()
    },

    async({app_token})=>{

        const token = await getToken();

        const result = await axios.get(
            `${FEISHU_API}/open-apis/bitable/v1/apps/${app_token}`,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );


        return {
            content:[
                {
                    type:"text",
                    text:JSON.stringify(result.data,null,2)
                }
            ]
        };

    }
);




// 获取表列表
server.tool(
    "feishu_list_tables",
    "获取 Base 的数据表列表",
    {
        app_token:z.string()
    },

    async({app_token})=>{

        const token = await getToken();

        const result = await axios.get(
            `${FEISHU_API}/open-apis/bitable/v1/apps/${app_token}/tables`,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        );


        return {
            content:[
                {
                    type:"text",
                    text:JSON.stringify(result.data,null,2)
                }
            ]
        };

    }
);



const app = express();

app.use(express.json());


app.post("/mcp", async(req,res)=>{

    const transport =
        new StreamableHTTPServerTransport({
            sessionIdGenerator:undefined
        });


    await server.connect(transport);

    await transport.handleRequest(
        req,
        res,
        req.body
    );

});



app.get("/",(req,res)=>{

    res.json({
        status:"feishu mcp running"
    });

});


const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

    console.log(
        "MCP running on "+PORT
    );

});
