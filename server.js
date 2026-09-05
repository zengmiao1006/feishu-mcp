import express from "express";
import axios from "axios";

const app = express();

app.use(express.json());


const FEISHU_API = "https://open.feishu.cn";


// 获取飞书 Token
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



// 首页
app.get("/", (req,res)=>{

    res.json({
        name:"feishu-mcp",
        status:"running"
    });

});



// 测试飞书连接
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



// 获取 Base 信息
app.get("/base", async(req,res)=>{

    try{

        const app_token = req.query.app_token;


        if(!app_token){

            return res.json({
                success:false,
                error:"缺少 app_token"
            });

        }


        const token = await getToken();


        const result = await axios.get(

            `${FEISHU_API}/open-apis/bitable/v1/apps/${app_token}`,

            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }

        );


        res.json({

            success:true,

            data:result.data

        });


    }catch(e){


        res.json({

            success:false,

            error:e.response?.data || e.message

        });


    }

});




// 启动服务
const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

    console.log(
        "Feishu MCP running on port "+PORT
    );

});
