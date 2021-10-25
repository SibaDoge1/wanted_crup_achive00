# 원티드 프리온보딩 선발과제

## 개요

- Node.js(express)와 sqlite를 이용하여 Restful Api의 기준을 최대한 준수하며 구현하였습니다.
- mocha를 이용하여 **유닛테스트**가 가능합니다.
- models폴더 내에 DB관련 모듈이 들어있습니다. 데이터베이스의 사용편의를 위해 Sequelize 모듈을 사용하였습니다. 
- Routes 폴더 내에 api루트, 유저관련, 게시글관련, 인증관련으로 나눠진 Router들이 존재합니다.
- 토큰인증은 JWT를 사용하였습니다.
- nodemon과 pm2를 사용하며, VSCode에서의 실행을 위해 launch.json에 사전설정이 되어있습니다.

## 서버 실행  

### 사전 작업

- 실행을 위해 nodemon 혹은 pm2가 필요합니다. 모듈에 포함되어 있으나, 전역 모듈을 원하는 경우 터미널에 'npm run before'을 입력하여 설치가능합니다.

### 디버그모드로 실행

- nodemon을 사용합니다. 'npm run debug'를 입력하여 실행합니다.

### 프로덕션 모드로 실행

- pm2를 사용합니다. 'npm start'를 입력하여 실행, 'npm stop'을 입력하여 중지합니다.

### 유닛테스트

- mocha를 사용합니다. 'npm test'를 입력하여 실행합니다.

## API 문서

- [GET] api/auth
- [POST] api/users
- [GET] api/posts  
- [GET] api/posts/:postid  
- [POST] api/posts  
- [PUT] api/posts/:postid  
- [DELETE] api/posts/:postid

### 공통 사항

- 모든 api 요청에서, 어떠한 이유로 요청을 거부당할 경우 Response 형태는 다음과 같습니다
  
    ```json
    {  
    "success": false,  
    "message": "에러메세지",  
    "data": null  
    }
    ```

### 1. [GET] api/auth

- **Description**: API에 엑세스 토큰을 요청합니다
- **Request Example**:  
    
    Body: json
    
    ```json
    { 
    "username": "test1", 
    "password": "Password1" 
    }
    ```

    - **Response Example**:  

    Body: json

    ```json
    {  
    "success":  true,  
    "message":  "User [test] token is generated!",
    "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OThkZGI2MzIyYWMxMDExZTA3MDJjYjAiLCJ1c2VybmFtZSI6InRlc3QxIiwibmFtZSI6InRlc3QxIiwiZW1haWwiOiIiLCJpYXQiOjE1MDQ3MzI2NzcsImV4cCI6MTUwNDgxOTA3N30.4eG2zGpSeY2XezKB4Djf6usy7DdygIybR1VKUBj-ScE"  
    }
    ```

### 2. [POST] api/users

- **Description**: 유저를 생성합니다.
- **Request Example**:

    Body: json  

    ```json  
    {   
    "username": "test1",   
    "password": "Password1"   
    }  
    ```  
  

-  **Response Example**:   

    Body: json  

    ```json  
    {    
    "success":  true,    
    "message":  "user [test] created!",  
    "data": null
    }  
    ```
### 3. [GET] api/posts
-  **Description**: 게시글 목록을 받아옵니다(postid 내림차순). page, size 쿼리를 이용하여 pagination이 가능합니다.
-  **Request Example**:   

    URL:      
    ```api/posts?page=1&size=3 ``` (page=페이지 번호(1~), size = 페이지 당 항목 수)
-  **Response Example**:   

    Body: json   
    ```json    
    {      
    "success":  true,      
    "message":  null,    
    "data": 
        {
            "count": 3,
            "posts": 
                [
                    {
                        "postid": 4,
                        "author": "test",
                        "title": "te1stpo1st",
                        "content": "helloworld",
                        "createdAt": "2021-10-25T16:48:14.159Z",
                        "updatedAt": "2021-10-25T16:48:14.159Z"
                    },
                    {
                        "postid": 3,
                        "author": "test",
                        "title": "testpo1st",
                        "content": "helloworld",
                        "createdAt": "2021-10-25T16:48:11.459Z",
                        "updatedAt": "2021-10-25T16:48:11.459Z"
                    },
                    {
                        "postid": 2,
                        "author": "test",
                        "title": "testpost",
                        "content": "helloworld",
                        "createdAt": "2021-10-25T16:48:03.200Z",
                        "updatedAt": "2021-10-25T16:48:03.200Z"
                    }
                ]
        }
    }
    ```

### 4. [GET] api/posts/:postid
-  **Description**: 해당 게시글을 가져옵니다.
-  **Request Example**: 
    
    URL:      
    ```api/posts/1```
    (1은 postid)

-  **Response Example**:   

    Body: json   

    ```json   
    {        
    "success":  true,        
    "message":  null,      
    "data": 
        {
            "postid": 1,
            "author": "test",
            "title": "testpost",
            "content": "helloworld",
            "createdAt": "2021-10-25T16:48:03.200Z",
            "updatedAt": "2021-10-25T16:48:03.200Z"
        }
    }
    ```
### 5. [POST] api/posts
-  **Description**: 게시글을 생성합니다. 헤더에 x-access-token이 필요합니다  
-  **Request Example**:   

    Header:   
    ```x-access-token: "auth를 통해 받은 토큰"  ```
    
    Body: json   
    ```json  
    {       
    "username": "test1",       
    "password": "Password1"       
    }      
    ```   

-  **Response Example**:   

    Body: json   

    ```json   
    {        
    "success":  true,        
    "message":  "post [hello] created!",      
    "data": {
    "postid":1 //post의 id  
    }  
    }
    ```
### 6. [PUT] api/posts/:postid
-  **Description**: 게시글을 수정합니다. 헤더에 x-access-token이 필요합니다   
-  **Request Example**: 

    Header:   
    ```
    x-access-token: "auth를 통해 받은 토큰"   
    ```

    URL:      
    ```api/posts/1```    (1은 postid)

    Body: json   
    

    ```json   
    {
    "title":"newpost",
    "content":"hahaha"
    }
    ```   
  

-  **Response Example**:   
Body: json   
  

    ```json   
    {          
    "success":  true,          
    "message":  "postid [1] updated!",        
    "data": null  
    }  
    ```
### 7. [DELETE] api/posts/:postid  
-  **Description**: 게시글을 삭제합니다. 헤더에 x-access-token이 필요합니다   
-  **Request Example**:   

    Header:   
    ```x-access-token: "auth를 통해 받은 토큰"   ```


    URL:      
    ```api/posts/1```
    (1은 postid)

    Body: json   
        
    

    ```json   
    {  
    "postid": "1"
    }  
    ```   
    
  

-  **Response Example**:   

    Body: json   
        
    

    ```json   
    {            
    "success":  true,            
    "message":  "postid [1] deleted!",          
    "data": null    
    }    
    ```