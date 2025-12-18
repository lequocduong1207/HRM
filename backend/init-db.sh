#!/bin/bash

echo "Waiting for SQL Server to start..."
sleep 40

echo "Creating database HRM_DB..."
for i in {1..30}; do
    /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Pass@12345678" -C -Q "
    IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'HRM_DB')
    BEGIN
        CREATE DATABASE HRM_DB;
        PRINT 'Database HRM_DB created successfully';
    END
    ELSE
    BEGIN
        PRINT 'Database HRM_DB already exists';
    END
    " && break
    echo "Waiting for SQL Server to be ready... attempt $i"
    sleep 2
done

echo "Database initialization completed!"
