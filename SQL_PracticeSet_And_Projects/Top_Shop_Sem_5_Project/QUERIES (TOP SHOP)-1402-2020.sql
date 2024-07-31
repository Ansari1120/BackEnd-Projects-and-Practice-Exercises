--lab 03 queries 

--1) 
select item_name,price,3.74*price+price as Result from [Items_Catalogue] 
--2)
select client_name as Client,Contact as [contact person] from clients 
--3)
select id,client_name,contact,Nation,cities from clients where ID between 20 and 40 
--4)
select id,client_name,contact,nation,cities from clients where cities='Tokyo' or cities ='Oslo' or cities='Beirut' 
--5)
select * from clients where Client_NAME like '___a%' 
--6)
select client_name,nation from clients where Nation not in ('UK','Rome')   

  

  --lab04 queries 
--1)
select Worker_ID as ID,Worker_name as Employee,designation as Position from Management 
--2)
update [Items_Catalogue] set stock_available = 62 where Product_ID =12 
--3)
  select client_name from clients where client_name like '%s' 
--4)
select * from  clients where Contact_Designation='programmer' 

  

-- lab 05 queries 
--1)
select client_name from clients order by Client_NAME desc 
--2)
select Category_ID,floor(max(price)) as Maximum,floor(min(price)) as minimum,floor(sum(price)) as sum,floor(AVG(price)) as average from Items_Catalogue group by Category_ID 
--3)
select Category_ID,floor(max(price)) as Maximum,floor(min(price)) as minimum,floor(sum(price)) as sum,floor(AVG(price)) as average from Items_Catalogue where Price between 50 and 100 group by Category_ID 
--4)
    select region,count(region) as [employees whom belong to this region] from clients where region is not null group by Region  
--5)
select Contact_Designation,Contact from clients order by Contact_Designation desc 
--6)
select Product_ID,count(Quantity) as [total orders by each product_id] from Deliveries where Product_ID in (select Product_ID from Deliveries group by Product_ID having count(Quantity) > 3) group by Product_ID 
--7)
    select city,count(city) as [People living in each unique city more than 1] from management where city in (select city from management group by city having count(city) > 1) group by city 
--8)
select distinct city from management where city in (select city from management group by city having count(city)>=2) 
--9)
select product_id,max(shipment_price) as [Maximum Price],min(shipment_price) as [Minimum Price] from Deliveries group by Product_ID order by Product_ID asc 
--10)
select city,count(city) as [Employees living in a city at least two] from management where city in (select city from management group by city having count(city)<=2 )group by city 
--11)
select item_name , max(price) as [Maximum Price],min(price) as [Minimum Price] from [items_Catalogue] where price > 20 group by item_name order by max(price) 
--12)
select city,count(designation) as [no of employees with mentioned designation at least 2] from management where designation='Accounts Manager' 

and city in (select city from management group by city having count(city)<=2) group by city order by count(worker_id) 
--13)
select count(id) as [Peoples having manager along their contact title whose region is not null ] from clients where contact_designation like '%Manager' And region is not null group by Region 

  

-- lab 06  
--1)
select worker_name,city from management where city = 'london'  select a.worker_name,b.worker_name from management a,management  
--2)
select Worker_name,designation from management where designation like '%Manager' 
--4)
select   deliveries.Product_ID as Id ,deliveries.delivery_id as DID ,clients.client_name as Name , deliveries.shipment_price as amount from clients left join deliveries  on clients.client_id=deliveries.client_id 
--5)
select delivery_id as OID,Product_id as Id,Shipment_Price as Amount,Quantity ,Discount from deliveries  --left join clients  on clients.client_id=deliveries.client_id 
--6)
select [Items_Catalogue].Item_Name,deliveries.discount from [Items_Catalogue] inner join deliveries on [Items_catalogue].product_id=deliveries.product_id where discount=42 
--7)
select Worker_name,city from management where city = 'london'  
--8)
select [Items_Catalogue].Item_name,Category.Item_Type_Name from [Items_catalogue] inner join Category on [Items_catalogue].Category_ID=Category.Category_ID 

--lab 07 
--1)
select deliveries.delivery_id,clients.firm_name from deliveries inner join clients on deliveries.Client_ID=clients.client_id where deliveries.delivery_id=10282 
--2)
select deliveries.delivery_id,clients.firm_name from deliveries inner join clients on deliveries.Client_ID=clients.client_id where deliveries.Delivery_Date='2012-08-04' 
--3)
select courier.Supply_ID,[Items_Catalogue].Item_Name from courier inner join [Items_Catalogue] on [Items_Catalogue].supply_id=courier.Supply_ID where courier.Trade_Company_Name='DH Linkers Associates' or courier.Trade_Company_Name='Flora vales International Traders' or courier.Trade_Company_Name='Confined Traders' 
--4)
select courier.Trade_Company_Name from courier where supply_id in (select [Items_Catalogue].supply_id from [Items_Catalogue] join category on (category.Category_ID=[Items_Catalogue].category_id) and category.Item_Type_Name='Fashion') 
--5)
select [Items_Catalogue].Category_ID,courier.Trade_Company_Name from [Items_Catalogue] join courier on ([Items_Catalogue].supply_id= courier.supply_id) where Category_ID = 4 group by [Items_Catalogue].Category_ID,courier.Trade_Company_Name 
--6)
select Courier.Supply_ID,[Items_Catalogue].category_id,Courier.Trade_Company_Name  

    from Category inner join [Items_Catalogue] on Category.Category_ID=[Items_Catalogue].Category_ID  

    inner join Courier on [Items_Catalogue].supply_id=Courier.Supply_ID where 

    Category.Category_ID=8 group by 

    Category.Category_ID,Courier.Supply_ID,Courier.Trade_Company_Name,[Items_Catalogue].category_id 
--7)
select clients.client_id as customers_id,clients.client_Name as customer ,Management.worker_name as serving_employee from 

     clients,management where clients.contact_designation=management.designation 
--11)
select clients.client_id,max([Items_Catalogue].price) as [Most Amount spent by a Client] from clients inner join Deliveries on clients.client_id=deliveries.Client_ID 

inner join [Items_Catalogue] on [Items_Catalogue].product_id=deliveries.Product_ID group by clients.client_id order by max([Items_Catalogue].price) desc 

  
--12)
(select client_id,client_name from clients) except (select client_id,client_name from 

       clients where client_id in (select Deliveries.Client_ID from Deliveries)) 