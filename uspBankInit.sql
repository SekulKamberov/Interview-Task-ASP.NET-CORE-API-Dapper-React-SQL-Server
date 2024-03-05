USE [Bank]
GO
/****** Object:  StoredProcedure [dbo].[uspBankInit]    Script Date: 3/5/2024 8:57:40 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[uspBankInit]  
AS
DECLARE @Ready BIT    	
SET NOCOUNT ON

BEGIN  
		BEGIN TRY
			BEGIN TRANSACTION    
			 
			IF NOT EXISTS(SELECT * FROM sys.databases WHERE name = 'Bank') 
				CREATE DATABASE Bank 
			  
			--EXEC ('USE Bank')  

			IF OBJECT_ID('TimeLogs', 'U') IS NOT NULL   
				DROP TABLE TimeLogs  

			IF OBJECT_ID('Projects', 'U') IS NOT NULL 
				DROP TABLE Projects  

			IF OBJECT_ID('Users', 'U') IS NOT NULL  
				DROP TABLE Users  

			IF OBJECT_ID('#UsersInit') IS NOT NULL 
				DROP TABLE #UsersInit  

			IF OBJECT_ID('#Email') IS NOT NULL 
				DROP TABLE #Email  
     
			CREATE TABLE Users(  
				Id INT IDENTITY(1, 1) PRIMARY KEY,
				Name NVARCHAR(100) NOT NULL,
				Sirname NVARCHAR(100) NOT NULL,
				Email NVARCHAR(100) null --NOT NULL UNIQUE  
			) 

				CREATE TABLE Projects(
				Id INT IDENTITY(1, 1) PRIMARY KEY,
				Name nvarchar(100) NOT NULL 
			) 

			CREATE TABLE TimeLogs(
				Id INT IDENTITY(1, 1) PRIMARY KEY, 
				UserId INT NOT NULL REFERENCES Users(Id),
				ProjectId INT NOT NULL REFERENCES Projects(Id),
				Created DATETIME DEFAULT 
				DATEADD(DAY, RAND(CHECKSUM(NEWID()))*(1+DATEDIFF(DAY, '01/01/2019', '3/4/2024')),'01/01/2019'), 
				--GETDATE(),  
				Hours FLOAT NOT NULL 
			) 
		  
			INSERT INTO Projects (Name) 
				VALUES ('My own'), ('Free Time'), ('Work')   
	
			CREATE TABLE #UsersInit (
				Id INT IDENTITY(1, 1) PRIMARY KEY,
				Name NVARCHAR(100) NOT NULL,
				Sirname NVARCHAR(100) NOT NULL,
				Email NVARCHAR(100) NULL  
			) 

			CREATE TABLE #Email (
				Id INT IDENTITY(1, 1) PRIMARY KEY,
				Name NVARCHAR(100) NOT NULL, 
			) 

			INSERT INTO #UsersInit (Name, Sirname) 
				VALUES 
				('John', 'Johnson'), ('Gringo', 'Lamas'), ('Mark', 'Jackson'), ('Lisa', 'Brown'), 
				('Maria', 'Mason'), ('Sonya', 'Rodriguez'), ('Philip', 'Roberts'), ('Jose', 'Thomas'), 
				('Lorenzo', 'Rose'), ('George', 'McDonalds'), ('Justin', 'McDonalds')  

			INSERT INTO #Email (Name) 
				VALUES 
				('hotmail.com'), ('gmail.com'), ('live.com')  

			DECLARE @Index INT = 1  
			DECLARE @Name NVARCHAR
			DECLARE @Sirname NVARCHAR 

			WHILE @Index < 100   
				BEGIN 
 					INSERT INTO Users (Name, Sirname) 
						VALUES( 
							(SELECT Name FROM #UsersInit WHERE id = (CAST(RAND()*100 AS INT) % 5) + 1), 
							(SELECT Sirname FROM #UsersInit WHERE id = (CAST(RAND()*100 AS INT) % 5) + 1) 
						)  

					UPDATE u 
					SET u.Email = LOWER(u2.Name + '.' + u2.Sirname + '@' + (SELECT Name FROM #Email WHERE id = (CAST(RAND()*100 AS INT) % 5) + 1)   )   
					FROM Users u
						INNER JOIN Users u2 ON u.id = u2.id 
				 
					DECLARE @Index2 INT = 1
					DECLARE @WorkingHours FLOAT  
					DECLARE @Counter INT = floor(RAND()*(21-1)+1)

					WHILE @Index2 < @Counter
						BEGIN 
							SET @WorkingHours = @WorkingHours + CAST(RAND()*(8.00-0.25)+0.25 AS NUMERIC(10,2)) --float 
							IF @WorkingHours < 8
								BEGIN
									INSERT INTO TimeLogs (UserId, ProjectId, Hours) 
									VALUES(
										@Index,  
										ISNULL(CHOOSE(floor(RAND()*(4-1)+1), 1, 2, 3), 2), 
										@WorkingHours     
									)
									 --break 
								END 
							SET @Index2 = @Index2 + 1	 	
						END
					SET @Counter = 0 
					SET @WorkingHours = 0 
					SET @Index2 = @Index2 + 0
					SET @Index = @Index + 1
				END
			COMMIT TRANSACTION  
			
			SET @Ready = 'True'
			SELECT @Ready  
		END TRY
		BEGIN CATCH
			SELECT  
				 ERROR_NUMBER() AS ErrorNumber  
				,ERROR_SEVERITY() AS ErrorSeverity  
				,ERROR_STATE() AS ErrorState  
				,ERROR_PROCEDURE() AS ErrorProcedure  
				,ERROR_LINE() AS ErrorLine  
				,ERROR_MESSAGE() AS ErrorMessage;  
		END CATCH 
END