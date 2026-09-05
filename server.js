import express from "express";
import axios from "axios";

const app = express();

app.use(express.json());


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


app.get("/", (req,res)=>{

    res.json({
        name:"feishu-mcp",
        status:"running"
    });

});


app.get("/test", async(req,res)=>{

    try{

        const token = await getToken();

        res.json({
            success:true,
            token: token.substring(0,10)+"..."
        });

    }catch(e){

        res.json({
            success:false,
            error:e.message
        });

    }

});


const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

    console.log(
        "Feishu MCP running on port "+PORT
    );

});
