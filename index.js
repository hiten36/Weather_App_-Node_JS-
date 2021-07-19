const http=require('http');
const fs=require('fs');
const requests=require('requests');
const port=process.env.PORT || 8000;
function replaceVal(tempVal,orgVal)
{
    let temp=tempVal.replace('{%tempval%}',orgVal.main.temp);
    temp=temp.replace('{%tempmin%}',orgVal.main.temp_min);
    temp=temp.replace('{%tempmax%}',orgVal.main.temp_max);
    temp=temp.replace('{%location%}',orgVal.name);
    temp=temp.replace('{%country%}',orgVal.sys.country);
    let tempStatusObj={
        "Sunny":"https://i.ibb.co/RBFfnbp/sunny.png",
        "Cloudy":"https://i.ibb.co/tpzwknG/cloudy.png",
        "Haze":"https://i.ibb.co/tpzwknG/cloudy.png",
        "Rainy":"https://i.ibb.co/vv1P3FG/rainy.png"
    }
    temp=temp.replace('{%tempStatus%}',tempStatusObj[orgVal.weather[0].main]);
    return temp;
}
const server=http.createServer((req,res)=>{
    res.statusCode=200;
    res.setHeader('content-type','text/html');
    if(req.url=='/')
    {
        var file=fs.readFileSync('index.html','utf-8');
        // res.end(file.toString());
        requests('http://api.openweathermap.org/data/2.5/weather?q=Jaipur&units=metric&appid=d8b9d22050bb6ab31f9d6ea2fd77a884').on('data',(chunk)=>{
            console.log(JSON.parse(chunk));
            let data1=[JSON.parse(chunk)];
            let realTimeData=data1.map((val)=>{
                return replaceVal(file,val);
            })
            res.write(realTimeData.toString());
            // console.log(realTimeData);
        }).on('end',(err)=>{
            if(err)
            {
                console.log(err);
            }
            res.end();
        })
    }
})
server.listen(port,()=>{
    console.log('Listening at port ', port);
})