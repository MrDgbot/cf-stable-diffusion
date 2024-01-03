## 项目介绍

这是一个`cloudflare`的ai worker,可以把`cloudflare`提供的`@cf/stabilityai/stable-diffusion-xl-base-1.0`
模型的输入和输出接口转换为`openai`的`dalle-3`接口的输入和输出。从而可以和目前支持openai格式的服务进行集成。

参考 https://github.com/MagicalMadoka/cf-sd-to-dalle3
## 部署方法

#### 1. 进入https://dash.cloudflare.com/ 找到AI => Workers Al
  <img width="100%" height="10%" alt="image" src="https://github.com/MrDgbot/cf-stable-diffusion/assets/60038945/d4daf5f7-84b8-4f27-827a-48f5fcb8a593">
  
#### 2. 选择一个AI可以绑定的模板
  <img width="100%" height="10%" alt="image" src="https://github.com/MrDgbot/cf-stable-diffusion/assets/60038945/e8d92699-b816-4cf2-8494-4e99f743f57f">
  
#### 3. 确认AI绑定
  <img width="100%" height="10%" alt="image" src="https://github.com/MrDgbot/cf-stable-diffusion/assets/60038945/697926e2-fd1a-4cdd-893a-1ada1df0f07a">

#### 4. **复制项目中index.js文件**
   
#### 5. 点击编辑代码，然后粘贴index.js，
  <img width="100%" height="10%" src="https://github.com/MrDgbot/cf-stable-diffusion/assets/60038945/3b9a2660-96f7-48f8-8575-404d462cb3c0">
  
#### 6. 保存部署即可
   <img width="1418" alt="image" src="https://github.com/MrDgbot/cf-stable-diffusion/assets/60038945/652df1e2-bb7e-47a2-a519-9eef74f4c584">

## 使用

假如你的worker被分配的路由是`cf-sd-to-dalle3.madokax.workers.dev`

### Example request

```bash
curl https://cf-sd-to-dalle3.madokax.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "model": "dall-e-3",
    "prompt": "A cute cat",
    "n": 1,
    "size": "1024x1024"
  }'
```

### Example Response
```bash
{
  "created": 1589478378,
  "data": [
    {
      "url": "https://..."
    },
    {
      "url": "https://..."
    }
  ]
}
```

### oneapi

- 渠道：自定义
- Base URL：https://cf-sd-to-dalle3.madokax.workers.dev
- 模型：dall-e-3
- 密钥：随便填点啥

## 致谢

- https://cdn.ipfsscan.io
- https://github.com/MagicalMadoka
