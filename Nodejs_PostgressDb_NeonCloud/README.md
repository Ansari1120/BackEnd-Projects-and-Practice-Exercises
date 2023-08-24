Create Project : 
npm init (follow onscreen instruction).
Create A new Database : 
![image](https://github.com/Ansari1120/BackEnd-Projects-and-Practice-Exercises/assets/114314363/805f3a63-9c8b-4af2-b965-69f5b875ff6c)

Create A New Branch : 
![image](https://github.com/Ansari1120/BackEnd-Projects-and-Practice-Exercises/assets/114314363/00017f16-c0bd-4e46-9fbb-dcb1b021acce)
![image](https://github.com/Ansari1120/BackEnd-Projects-and-Practice-Exercises/assets/114314363/44d454b0-080f-4f80-a692-866829a45bb4)
![image](https://github.com/Ansari1120/BackEnd-Projects-and-Practice-Exercises/assets/114314363/3a2c5448-782f-48f5-98dc-93181e6a7080)

Connect to a Project (select Your Desired Project here we connect to Node js):
Click on connect:
![image](https://github.com/Ansari1120/BackEnd-Projects-and-Practice-Exercises/assets/114314363/8e639f85-4328-4d7a-b959-4090604b6289)
![image](https://github.com/Ansari1120/BackEnd-Projects-and-Practice-Exercises/assets/114314363/0796e0bf-43b0-42a9-83b1-ab5eea69e23e)

To select your desired project to connect click on :
![image](https://github.com/Ansari1120/BackEnd-Projects-and-Practice-Exercises/assets/114314363/5c178883-063c-45af-b377-b6c4d03f22e9)

Copy env data and then create .env file past data there:
First install env capability to the project with:
Site : https://www.npmjs.com/package/dotenv
Package : npm i dotenv
![image](https://github.com/Ansari1120/BackEnd-Projects-and-Practice-Exercises/assets/114314363/fe4695e8-8664-408a-853b-eabc5b016fe1)

Also add :
Site : https://www.npmjs.com/package/postgres
Package : npm i postgres
Add Script :
![image](https://github.com/Ansari1120/BackEnd-Projects-and-Practice-Exercises/assets/114314363/053a4563-65b0-403d-a6c6-0cfb361765d6)

Create table : 
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    department VARCHAR(50),
    salary NUMERIC(10, 2)
);

Insert data into a table : 
INSERT INTO employees (first_name, last_name, department, salary)
VALUES ('John', 'Doe', 'IT', 60000.00),
       ('Jane', 'Smith', 'HR', 50000.00),
       ('Michael', 'Johnson', 'Finance', 75000.00);

Call select Query : 
![image](https://github.com/Ansari1120/BackEnd-Projects-and-Practice-Exercises/assets/114314363/de01b971-8be1-4310-b402-b465029da2c0)
![image](https://github.com/Ansari1120/BackEnd-Projects-and-Practice-Exercises/assets/114314363/2ba35e06-9c19-4a64-b726-b409c3bfab4c)


To View Table on the neon cloud :
![image](https://github.com/Ansari1120/BackEnd-Projects-and-Practice-Exercises/assets/114314363/85f9b6cd-3bfe-4abb-9478-04aaf7f57739)

To Test Queries on the neon cloud :
![image](https://github.com/Ansari1120/BackEnd-Projects-and-Practice-Exercises/assets/114314363/ced33077-9756-4757-93c7-571e639debfc)

To View Current Databases on the neon cloud :
![image](https://github.com/Ansari1120/BackEnd-Projects-and-Practice-Exercises/assets/114314363/b628342e-bf03-47ec-8df1-92f6a8d6baf6)


 
