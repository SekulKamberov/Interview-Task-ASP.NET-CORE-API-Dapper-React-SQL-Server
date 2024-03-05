 
CREATE PROCEDURE uspGetUsersSortFilt  
 @Page INT = 1,  
 @Limit INT = 10,    
 @SortColumn NVARCHAR(30) = 'Name',  
 @SortDirection NVARCHAR(30) = 'ASC',
 @StartDate DateTime = NULL,
 @EndDate DateTime = NULL
AS  
BEGIN  
  
SELECT t.*, u.*, p.Name as ProjectName
    FROM TimeLogs t
    LEFT JOIN Users u ON t.UserId = u.Id
    LEFT JOIN Projects p ON t.ProjectId = p.Id
	WHERE (@StartDate IS NULL OR t.Created >= @StartDate)
    AND (@EndDate IS NULL OR t.Created <= @EndDate)
ORDER BY
	CASE WHEN @SortColumn='Name' AND @SortDirection='ASC' then u.Name END,  
	CASE WHEN @SortColumn='Name' AND @SortDirection='DESC' then u.Name  END DESC,  
	CASE WHEN @SortColumn='Sirname' AND @SortDirection='ASC' then u.Sirname END,  
	CASE WHEN @SortColumn='Sirname' AND @SortDirection='DESC' then u.Sirname  END DESC,  
	CASE WHEN @SortColumn='Email' AND @SortDirection='ASC' then u.Email END,  
	CASE WHEN @SortColumn='Email' AND @SortDirection='DESC' then u.Email END DESC,
	CASE WHEN @SortColumn='Project' AND @SortDirection='ASC' then p.Name END,  
	CASE WHEN @SortColumn='Project' AND @SortDirection='DESC' then p.Name END DESC,
	CASE WHEN @SortColumn='Created' AND @SortDirection='ASC' then t.Created END,  
	CASE WHEN @SortColumn='Created' AND @SortDirection='DESC' then t.Created END DESC 

OFFSET (@Page - 1) * @Limit ROWS FETCH NEXT @Limit ROWS ONLY   
 
  
SELECT COUNT(id) AS TotalRecords,CAST(CEILING((COUNT(id)*1.0)/@Limit)AS INT) AS TotalPages 
FROM Users  
  
END  
GO

EXEC uspGetUsersSortFilt 