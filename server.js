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
            token:token.substring(0,10)+"..."
        });


    }catch(e){

        res.json({
            success:false,
            error:e.response?.data || e.message
        });

    }

});




// 获取 Base 信息
app.get("/base", async(req,res)=>{

    try{

        const app_token = req.query.app_token;

        const token = await getToken();


        const result = await axios.get(

            `${FEISHU_API}/open-apis/bitable/v1/apps/${app_token}`,

            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }

        );


        res.json(result.data);


    }catch(e){

        res.json({
            error:e.response?.data || e.message
        });

    }

});





// 获取 Base 表列表
app.get("/tables", async(req,res)=>{

    try{

        const app_token = req.query.app_token;

        const token = await getToken();


        const result = await axios.get(

            `${FEISHU_API}/open-apis/bitable/v1/apps/${app_token}/tables`,

            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }

        );


        res.json(result.data);


    }catch(e){

        res.json({
            error:e.response?.data || e.message
        });

    }

});





// 获取表数据
app.get("/records", async(req,res)=>{


    try{


        const app_token = req.query.app_token;

        const table_id = req.query.table_id;


        const token = await getToken();



        const result = await axios.get(

            `${FEISHU_API}/open-apis/bitable/v1/apps/${app_token}/tables/${table_id}/records`,

            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }

        );


        res.json(result.data);



    }catch(e){


        res.json({
            error:e.response?.data || e.message
        });


    }


});






const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

    console.log(
        "Feishu MCP running on port "+PORT
    );

});
