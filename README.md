# auth-demo
An example of JWT  for Koa2
### Simple Introduction Of Url

| Url            | Description               | Method | Authorization | Response                 |
| :------------- | :------------------------ | :----- | :------------ | ------------------------ |
| /api/v1/login  | login                     | post   | none          | accessToken,refreshToken |
| /api/v1/signup | signup                    | post   | none          | none                     |
| /api/v1/token  | get token by refreshToken | get    | refreshToken  | accessToken,refreshToken |
| /api/v1/json   | get json by accessToken   | get    | accessToken   | none                     |

以上表格只是表达url和token的对应关系，其他数据不在该表格表达范围之内。

接下来的优化待更新中







