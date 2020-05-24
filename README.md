### warchest

How to run 
1. ```npm i``` or ```npm install``` to install login form
2. Create .env file
  ```
    # Server config
  NODE_ENV=development
  PORT=8000

  #Database config
  DATABASE=database_here
  DATABASE_PASSWORD=database_pass

  #JWT config
  JWT_SECRET=
  JWT_EXPIRES_IN=

  #Email config
  EMAIL_USERNAME=
  EMAIL_PASSWORD=
  EMAIL_HOST=
  EMAIL_PORT=

  EMAIL_FROM=

  SENDGRID_USERNAME=
  SENDGRID_PASSWORD=


  ```
  
  3. type ```npm run dev``` to run project in development mode or ```npm run prod``` to run in production mode. If you want debug type ```npm run debug```
  
  #### Note:
  Please install nodemon if you don't have nodemon in global.
