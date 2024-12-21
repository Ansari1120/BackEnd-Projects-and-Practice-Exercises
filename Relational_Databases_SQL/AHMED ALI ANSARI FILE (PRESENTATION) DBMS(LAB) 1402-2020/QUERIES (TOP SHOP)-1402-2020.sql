--lab 03 queries 

--1)Multiply two values
select item_name,price,3.74*price+price as Result from [Items_Catalogue] 
--2)Us alias (as)
select client_name as Client,Contact as [contact person] from clients 
--3) Display the records from customers table ranging Customers ids from 20 to 40. 
select client_id,client_name,contact,Nation,cities from clients where client_ID between 20 and 40 
--4)
select client_id,client_name,contact,nation,cities from clients where cities='Tokyo' or cities ='Oslo' or cities='Beirut' 
--5)Display the records from customers table of Persons who contains A in their name at 4th Position.
select * from clients where Client_NAME like '___a%' 
--6)Perform a query of those who dont belong to the city uk and rome
select client_name,nation from clients where Nation not in ('UK','Rome')     

  --lab04 queries 
--1) Write a Query using “As” for extracting specific data from a Table.
select Worker_ID as ID,Worker_name as Employee,designation as Position from Management 
--2) Write a Query using “Update” for Changing specific data from a Table.
update [Items_Catalogue] set stock_available = 26 where Product_ID =15 
--3) Write a Query using “Like” for fetching specific data from a Table.
  select client_name from clients where client_name like '%s' 
--4) Write a Query using “Where” for fetching specific data from a Table.
select * from  clients where Contact_Designation='programmer' 


-- lab 05 queries 
--1)Write a query to order employee first name in Descending Order.
select client_name from clients order by Client_NAME desc 
--2)Display the highest, lowest, sum and average UnitPrice of each Category. Label column as CategoryId, 
--Maximum, Minimum, Sum and Average, respectively. Round your results to the nearest whole number. (Table: Products)
select Category_ID,floor(max(price)) as Maximum,floor(min(price)) as minimum,floor(sum(price)) as sum,floor(AVG(price)) as average from Items_Catalogue group by Category_ID 
--3)Display the highest, lowest, sum and average UnitPrice of each Category, where highest UnitPrice lies in 
--the range of 50$ to 100$. Label column as CategoryId, Maximum, Minimum, Sum and Average, respectively. (Table: Products)
select Category_ID,floor(max(price)) as Maximum,floor(min(price)) as minimum,floor(sum(price)) as sum,floor(AVG(price)) as average from Items_Catalogue where Price between 50 and 100 group by Category_ID 
--4)From customers table, Count all customers is each region where region is not null. (Table: Customers)
select region,count(region) as [employees whom belong to this region] from clients where region is not null group by Region  
--5)Write a query to display the number of ContactName with same ContactTitle. Sort contact title in descending order. (Table: Customers)
select Contact_Designation,Contact from clients order by Contact_Designation desc 
--6)Write a query that count all orders against each product id. No of orders should be greater than 50. (Table: [Order Details])
select Product_ID,count(Quantity) as [total orders by each product_id] from Deliveries where Product_ID in (select Product_ID from Deliveries group by Product_ID having count(Quantity) > 3) group by Product_ID 
--7)How many people are in each unique city in the employee table that have more than one person in the 
--city? Select the city and display the number of how many people are in each if it's greater than 1.(Table: Employees)
select city,count(city) as [People living in each unique city more than 1] from management where city in (select city from management group by city having count(city) > 1) group by city 
--8)List only those cities in which more than or equals to 2 employees are living.
select distinct city from management where city in (select city from management group by city having count(city)>=2) 
--9)From the [Order Details] table, select the Product’s id , maximum price and minimum price for each specific 
--product in the table, sort the list by product id in ascending order
select product_id,max(shipment_price) as [Maximum Price],min(shipment_price) as [Minimum Price] from Deliveries group by Product_ID order by Product_ID asc 
--10)Retrieve the number of employees in each city in which there are at least 2 employees.
select city,count(city) as [Employees living in a city at least two] from management where city in (select city from management group by city having count(city)<=2 )group by city 
--11)Find the product name, maximum price and minimum price of each product having maximum price greater than 20.00 $. Order by maximum price.
select item_name , max(price) as [Maximum Price],min(price) as [Minimum Price] from [items_Catalogue] where price > 20 group by item_name order by max(price) 
--12)Find the number of sales representatives in each city that contains at least 2 sales representatives. Order by the number of employees
select City,count(designation) as [no of employees with mentioned designation at least 2] from management where designation='Accounts Manager' 
and city in (select city from management group by city having count(city)<=2) group by city order by count(worker_id) 
--13)From customers table, Count all customers in each region whose contactname contains manager and region is not null. (Table: Customers)
select count(Client_ID) as [Peoples having manager along their contact title whose region is not null ],Client_NAME from clients where contact_designation like '%Manager' And region is not null group by Region,Client_NAME

  

-- lab 06  
--1)Write a query to list the names of employees that belongs to the same location as the employee named Nancy.
select worker_name,city from management where worker_name = 'Kerry Wilson'  -- select a.worker_name,b.worker_name,a.city,b.City from management a,management b  where a.City=b.City and a.Worker_Name = 'kery Wilson'
--2)Write a query to list the name of employees in front of the names of their mangers.
select Worker_name,designation from management where designation like '%Manager' 
--4)Write a query to display the following records of all the customers along with their order details (if any).
select   deliveries.Product_ID as Id ,deliveries.delivery_id as DID ,clients.client_name as Name , deliveries.shipment_price as amount from clients left join deliveries  on clients.client_id=deliveries.client_id where deliveries.Product_ID  is not null
--5)Write a query to display all the orders placed by a customers.
select delivery_id as OID,Product_id as Id,Shipment_Price as Amount,Quantity ,Discount from deliveries  --left join clients  on clients.client_id=deliveries.client_id 
--6)Name the store that offer initial customer discount.
select [Items_Catalogue].Item_Name,deliveries.discount from [Items_Catalogue] inner join deliveries on [Items_catalogue].product_id=deliveries.product_id where discount=42 
--7)Name all the employees working in London.
select Worker_name,city from management where city = 'london'  
--8)List the stores of all title.
select [Items_Catalogue].Item_name,Category.Item_Type_Name from [Items_catalogue] inner join Category on [Items_catalogue].Category_ID=Category.Category_ID 

--lab 07 
--1)Find the company’s name that placed order 10290. (Tables : Customers & Orders)
select deliveries.delivery_id,clients.firm_name from deliveries inner join clients on deliveries.Client_ID=clients.client_id where deliveries.delivery_id=10282 
--2)Find the Companies that placed orders in 1997 (Tables : Customers & Orders)
select deliveries.delivery_id,clients.firm_name from deliveries inner join clients on deliveries.Client_ID=clients.client_id where deliveries.Delivery_Date='2012-08-04' 
--3)Create a report that shows the product name and supplier id for all products supplied by 
--Exotic Liquids, Grandma Kelly's Homestead, and Tokyo Traders. (Tables : Products & Suppliers)
select courier.Supply_ID,[Items_Catalogue].Item_Name from courier inner join [Items_Catalogue] on [Items_Catalogue].supply_id=courier.Supply_ID where courier.Trade_Company_Name='DH Linkers Associates' or courier.Trade_Company_Name='Flora vales International Traders' or courier.Trade_Company_Name='Confined Traders' 
--4)Create a report that shows all products by name that are in the Seafood category. (Tables : Products & Categories)
select courier.Trade_Company_Name from courier where supply_id in (select [Items_Catalogue].supply_id from [Items_Catalogue] join category on (category.Category_ID=[Items_Catalogue].category_id) and category.Item_Type_Name='Fashion') 
--5)Create a report that shows all companies by name that sell products in CategoryID 8. (Tables : Supplier & Products)
select [Items_Catalogue].Category_ID,courier.Trade_Company_Name from [Items_Catalogue] join courier on ([Items_Catalogue].supply_id= courier.supply_id) where Category_ID = 4 group by [Items_Catalogue].Category_ID,courier.Trade_Company_Name 
--6)Create a report that shows all 5 companies by name that sell products in the Seafood category.(Tables: Suppliers, Products & Categories)
select Courier.Supply_ID,[Items_Catalogue].category_id,Courier.Trade_Company_Name  

    from Category inner join [Items_Catalogue] on Category.Category_ID=[Items_Catalogue].Category_ID  

    inner join Courier on [Items_Catalogue].supply_id=Courier.Supply_ID where 

    Category.Category_ID=8 group by 

    Category.Category_ID,Courier.Supply_ID,Courier.Trade_Company_Name,[Items_Catalogue].category_id 
--7)Write query using a “sub query” to display which Customers were served by which Employee use Northwind
select clients.client_id as customers_id,clients.client_Name as customer ,Management.worker_name as serving_employee from 

     clients,management where clients.contact_designation=management.designation 
--11)Write query using a “sub query” to give the customer id and amount spent of the customer who spent the most using Northwind
select clients.client_id,max([Items_Catalogue].price) as [Most Amount spent by a Client] from clients inner join Deliveries on clients.client_id=deliveries.Client_ID 

inner join [Items_Catalogue] on [Items_Catalogue].product_id=deliveries.Product_ID group by clients.client_id order by max([Items_Catalogue].price) desc 

  
--12)Write query using a “sub query” to list all Northwind customers who have not placed an order. 
(select client_id,client_name from clients) except (select client_id,client_name from 

       clients where client_id in (select Deliveries.Client_ID from Deliveries)) 



	 ALTER TABLE computer_science ADD last_name VARCHAR(50);
	   drop table category
	   drop database milkyway
