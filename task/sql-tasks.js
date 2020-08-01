'use strict';

/********************************************************************************************
 *                                                                                          *
 * The goal of the task is to get basic knowledge of SQL functions and                      *
 * approaches to work with data in SQL.                                                     *
 * https://dev.mysql.com/doc/refman/5.7/en/function-reference.html                          *
 *                                                                                          *
 * The course do not includes basic syntax explanations. If you see the SQL first time,     *
 * you can find explanation and some trainings at W3S                                       *
 * https://www.w3schools.com/sql/sql_syntax.asp                                             *
 *                                                                                          *
 ********************************************************************************************/


/**
 *  Create a SQL query to return next data ordered by city and then by name:
 * | Employy Id | Employee Full Name | Title | City |
 *
 * @return {array}
 *
 */
async function task_1_1(db) {
    // The first task is example, please follow the style in the next functions.
    let result = await db.query(`
        SELECT
           EmployeeID as "Employee Id",
           CONCAT(FirstName, ' ', LastName) AS "Employee Full Name",
           Title as "Title",
           City as "City"
        FROM Employees
        ORDER BY City, "Employee Full Name"
    `);
    return result[0];
}

/**
 *  Create a query to return an Order list ordered by order id descending:
 * | Order Id | Order Total Price | Total Order Discount, % |
 *
 * NOTES: Discount in OrderDetails is a discount($) per Unit.
 * @return {array}
 *
 */
async function task_1_2(db) {
    let result = await db.query(`
        SELECT
            OrderID as "Order Id",
            SUM(UnitPrice * Quantity) as "Order Total Price",
            Round((SUM(Discount * Quantity) * 100) / SUM(UnitPrice * Quantity), 3) as "Total Order Discount, %"
        FROM OrderDetails
        GROUP BY OrderID
        ORDER BY OrderID DESC
    `);
    return result[0]
}

/**
 *  Create a query to return all customers from USA without Fax:
 * | CustomerId | CompanyName |
 *
 * @return {array}
 *
 */
async function task_1_3(db) {
    let result = await db.query(`
        SELECT
            CustomerID as CustomerId,
            CompanyName
        FROM Customers
        WHERE Fax IS NULL AND Country = "USA";
    `);
    return result[0]
}

/**
 * Create a query to return:
 * | Customer Id | Total number of Orders | % of all orders |
 *
 * order data by % - higher percent at the top, then by CustomerID asc
 *
 * @return {array}
 *
 */
async function task_1_4(db) {
    let result = await db.query(`
        SELECT 
            CustomerID as "Customer Id",
            COUNT(OrderID) as "Total number of Orders",
            ROUND(COUNT(OrderID) / (SELECT 
                                        COUNT(OrderID) as "all orders"
                                    FROM
                                        northwind.Orders) * 100, 5)
            as "% of all orders"
        FROM northwind.Orders
        GROUP BY CustomerID
        ORDER BY 3 DESC, CustomerID;
    `);
    return result[0]
}

/**
 * Return all products where product name starts with 'A', 'B', .... 'F' ordered by name.
 * | ProductId | ProductName | QuantityPerUnit |
 *
 * @return {array}
 *
 */
async function task_1_5(db) {
    let result = await db.query(`
        SELECT 
            ProductID as ProductId, ProductName, QuantityPerUnit
        FROM northwind.Products
        WHERE ProductName regexp '^[A-F]'
        ORDER BY ProductName
    `);
    return result[0];
}

/**
 *
 * Create a query to return all products with category and supplier company names:
 * | ProductName | CategoryName | SupplierCompanyName |
 *
 * Order by ProductName then by SupplierCompanyName
 * @return {array}
 *
 */
async function task_1_6(db) {
    let result = await db.query(`
        SELECT 
            p.ProductName, 
            c.CategoryName, 
            s.CompanyName as SupplierCompanyName
        FROM 
            northwind.Products as p, 
            northwind.Categories as c, 
            northwind.Suppliers as s
        WHERE 
            p.CategoryID = c.CategoryID and p.SupplierID = s.SupplierID
        ORDER BY p.ProductName, SupplierCompanyName
    `);
    return result[0];    
}

/**
 *
 * Create a query to return all employees and full name of person to whom this employee reports to:
 * | EmployeeId | FullName | ReportsTo |
 *
 * Order data by EmployeeId.
 * Reports To - Full name. If the employee does not report to anybody leave "-" in the column.
 * @return {array}
 *
 */
async function task_1_7(db) {
    let result = await db.query(`
        SELECT  
            e.EmployeeID as EmployeeId, 
            concat(e.FirstName, " ", e.LastName)  as FullName,
            CASE
                WHEN e.ReportsTo is null
                THEN "-"
                ELSE concat(r.FirstName, " ", r.LastName)
                END
            as ReportsTo     
        FROM northwind.Employees as e
        LEFT JOIN northwind.Employees as r
            ON e.ReportsTo = r.EmployeeID
        ORDER BY e.EmployeeID
    `);
    return result[0]; 
}

/**
 *
 * Create a query to return:
 * | CategoryName | TotalNumberOfProducts |
 *
 * @return {array}
 *
 */
async function task_1_8(db) {
    let result = await db.query(`
        SELECT
            c.CategoryName, count(p.ProductName) as TotalNumberOfProducts
        FROM 
            northwind.Categories as c
        RIGHT JOIN northwind.Products as p
            ON c.CategoryID = p.CategoryID
        GROUP BY p.CategoryID
        ORDER BY c.CategoryName
    `);
    return result[0]; 
}

/**
 *
 * Create a SQL query to find those customers whose contact name containing the 1st character is 'F' and the 4th character is 'n' and rests may be any character.
 * | CustomerID | ContactName |
 *
 * @return {array}
 *
 */
async function task_1_9(db) {
    let result = await db.query(`
        SELECT 
            CustomerID, ContactName
        FROM northwind.Customers
        WHERE ContactName LIKE 'F__n%'
    `);
    return result[0]; 
}

/**
 * Write a query to get discontinued Product list:
 * | ProductID | ProductName |
 *
 * @return {array}
 *
 */
async function task_1_10(db) {
    let result = await db.query(`
        SELECT 
            ProductID, ProductName
        FROM northwind.Products
        WHERE Discontinued >= 1
    `);
    return result[0]; 
}

/**
 * Create a SQL query to get Product list (name, unit price) where products cost between $5 and $15:
 * | ProductName | UnitPrice |
 *
 * Order by UnitPrice then by ProductName
 *
 * @return {array}
 *
 */
async function task_1_11(db) {
    let result = await db.query(`
        SELECT
            ProductName, UnitPrice
        FROM northwind.Products
        WHERE UnitPrice BETWEEN 5 and 15
        ORDER BY UnitPrice, ProductName
    `);
    return result[0];
}

/**
 * Write a SQL query to get Product list of twenty most expensive products:
 * | ProductName | UnitPrice |
 *
 * Order products by price then by ProductName.
 *
 * @return {array}
 *
 */
async function task_1_12(db) {
    let result = await db.query(`
        SELECT 
            p.ProductName as ProductName, p.UnitPrice as UnitPrice
        FROM
            (SELECT 
                ProductName, UnitPrice
            FROM northwind.Products
            ORDER BY UnitPrice DESC
            limit 20) as p
        ORDER BY UnitPrice, ProductName
`);
return result[0];}

/**
 * Create a SQL query to count current and discontinued products:
 * | TotalOfCurrentProducts | TotalOfDiscontinuedProducts |
 *
 * @return {array}
 *
 */
async function task_1_13(db) {
    let result = await db.query(`
        SELECT 
            COUNT(ProductID) as TotalOfCurrentProducts, sum(Discontinued) as TotalOfDiscontinuedProducts
        FROM northwind.Products
    `);
return result[0];
}

/**
 * Create a SQL query to get Product list of stock is less than the quantity on order:
 * | ProductName | UnitsOnOrder| UnitsInStock |
 *
 * @return {array}
 *
 */
async function task_1_14(db) {
    let result = await db.query(`
        SELECT 
            ProductName, UnitsOnOrder, UnitsInStock
        FROM northwind.Products
        WHERE UnitsOnOrder > UnitsInStock
    `);
return result[0];
}

/**
 * Create a SQL query to return the total number of orders for every month in 1997 year:
 * | January | February | March | April | May | June | July | August | September | November | December |
 *
 * @return {array}
 *
 */
async function task_1_15(db) {
    let result = await db.query(`
        SELECT
            sum(month(OrderDate) = 1) as January, 
            sum(month(OrderDate) = 2) as February, 
            sum(month(OrderDate) = 3) as March,
            sum(month(OrderDate) = 4) as April,
            sum(month(OrderDate) = 5) as May,
            sum(month(OrderDate) = 6) as June,
            sum(month(OrderDate) = 7) as July,
            sum(month(OrderDate) = 8) as August,
            sum(month(OrderDate) = 9) as September,
            sum(month(OrderDate) = 10) as October,
            sum(month(OrderDate) = 11) as November,
            sum(month(OrderDate) = 12) as December
        FROM northwind.Orders
        WHERE year(OrderDate) = 1997
    `);
return result[0];
}

/**
 * Create a SQL query to return all orders where ship postal code is provided:
 * | OrderID | CustomerID | ShipCountry |
 *
 * @return {array}
 *
 */
async function task_1_16(db) {
    let result = await db.query(`
        SELECT 
            OrderID, CustomerID, ShipCountry
        FROM northwind.Orders
        WHERE ShipPostalCode is not null
    `);
return result[0];
}

/**
 * Create SQL query to display the average price of each categories's products:
 * | CategoryName | AvgPrice |
 *
 * @return {array}
 *
 * Order by AvgPrice descending then by CategoryName
 *
 */
async function task_1_17(db) {
    let result = await db.query(`
        SELECT 
            c.CategoryName, avg(p.UnitPrice) as AvgPrice
        FROM northwind.Categories as c
        right JOIN northwind.Products as p
        on c.CategoryID = p.CategoryID
        GROUP BY p.CategoryID
        ORDER BY AvgPrice DESC, CategoryName
    `);
    return result[0];
}

/**
 * Create a SQL query to calcualte total orders count by each day in 1998:
 * | OrderDate | Total Number of Orders |
 *
 * Order Date needs to be in the format '%Y-%m-%d %T'
 * @return {array}
 *
 */
async function task_1_18(db) {
    let result = await db.query(`
        SELECT 
        date_format(OrderDate, '%Y-%m-%d %T') as OrderDate, count(OrderID) as "Total Number of Orders"
        FROM northwind.Orders
        WHERE year(OrderDate) = "1998"
        GROUP BY OrderDate
    `);
    return result[0];
}

/**
 * Create a SQL query to display customer details whose total orders amount is more than 10000$:
 * | CustomerID | CompanyName | TotalOrdersAmount, $ |
 *
 * Order by "TotalOrdersAmount, $" descending then by CustomerID
 * @return {array}
 *
 */
async function task_1_19(db) {
    let result = await db.query(`
        SELECT  
            o.CustomerID as CustomerID, 
            c.CompanyName as CompanyName, 
            sum(od.UnitPrice * od.Quantity) as "TotalOrdersAmount, $"
        FROM northwind.Orders as o
        LEFT JOIN northwind.OrderDetails as od
            on o.OrderID = od.OrderID
        LEFT JOIN northwind.Customers as c
            on c.CustomerID = o.CustomerID
        GROUP BY CustomerID
        HAVING sum(od.UnitPrice * od.Quantity) > 10000
        ORDER BY 3 DESC, 1
    `);
    return result[0];
}

/**
 *
 * Create a SQL query to find the employee that sold products for the largest amount:
 * | EmployeeID | Employee Full Name | Amount, $ |
 *
 * @return {array}
 *
 */
async function task_1_20(db) {
    let result = await db.query(`
        SELECT 
            orders.EmployeeID as EmployeeID, 
            concat(e.FirstName, " ", e.LastName) as "Employee Full Name", 
            sum(oDetails.UnitPrice * oDetails.Quantity) as "Amount, $"
        FROM northwind.Orders as orders
        LEFT JOIN northwind.OrderDetails as oDetails
            ON orders.OrderID = oDetails.OrderID
        LEFT JOIN northwind.Employees as e
            ON orders.EmployeeID = e.EmployeeID
        GROUP BY orders.EmployeeID
        ORDER BY 3 DESC
        LIMIT 1
    `);
return result[0];
}

/**
 * Write a SQL statement to get the maximum purchase amount of all the orders.
 * | OrderID | Maximum Purchase Amount, $ |
 *
 * @return {array}
 */
async function task_1_21(db) {
    let result = await db.query(`
        SELECT 
            OrderID, sum(UnitPrice * Quantity) as "Maximum Purchase Amount, $"
        FROM  northwind.OrderDetails
        GROUP BY OrderID
        ORDER BY 2 desc
        LIMIT 1
    `);
    return result[0];
}

/**
 * Create a SQL query to display the name of each customer along with their most expensive purchased product:
 * | CompanyName | ProductName | PricePerItem |
 *
 * order by PricePerItem descending and them by CompanyName and ProductName acceding
 * @return {array}
 */
async function task_1_22(db) {
    let result = await db.query(`
        SELECT DISTINCT
        maxprice.CompanyName , p.ProductName as ProductName, maxprice.PricePerItem
        FROM (
            SELECT
                c.CompanyName as CompanyName, max(od.UnitPrice) as PricePerItem, c.CustomerID
            FROM northwind.Customers as c
            LEFT JOIN northwind.Orders as o
                ON c.CustomerID = o.CustomerID
            LEFT JOIN northwind.OrderDetails as od
                on o.OrderID = od.OrderID
            LEFT JOIN northwind.Products as p
                on od.ProductID = p.ProductID
            GROUP BY c.CompanyName, c.CustomerID
        ) as maxprice
        LEFT JOIN northwind.Orders as o
                ON maxprice.CustomerID = o.CustomerID
        LEFT JOIN northwind.OrderDetails as od
            on o.OrderID = od.OrderID and maxprice.PricePerItem = od.UnitPrice
        LEFT JOIN northwind.Products as p
            on od.ProductID = p.ProductID
        WHERE ProductName is not null
        ORDER BY PricePerItem DESC, CompanyName, ProductName

    `);
    return result[0];
}

module.exports = {
    task_1_1: task_1_1,
    task_1_2: task_1_2,
    task_1_3: task_1_3,
    task_1_4: task_1_4,
    task_1_5: task_1_5,
    task_1_6: task_1_6,
    task_1_7: task_1_7,
    task_1_8: task_1_8,
    task_1_9: task_1_9,
    task_1_10: task_1_10,
    task_1_11: task_1_11,
    task_1_12: task_1_12,
    task_1_13: task_1_13,
    task_1_14: task_1_14,
    task_1_15: task_1_15,
    task_1_16: task_1_16,
    task_1_17: task_1_17,
    task_1_18: task_1_18,
    task_1_19: task_1_19,
    task_1_20: task_1_20,
    task_1_21: task_1_21,
    task_1_22: task_1_22
};
