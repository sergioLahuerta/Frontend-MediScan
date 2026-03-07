-- Crear la base de datos
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'FamilyAffairDB')
    CREATE DATABASE FamilyAffairDB;

USE FamilyAffairDB;

-- Tabla para las sesiones de chat
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ChatSessions')
    CREATE TABLE ChatSessions (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        IsAnalyzed BIT NOT NULL DEFAULT 0
    );

-- Tabla para los mensajes
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ChatMessages')
    CREATE TABLE ChatMessages (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ChatSessionId INT NOT NULL,
        Sender NVARCHAR(50) NOT NULL,
        Content NVARCHAR(MAX) NOT NULL,
        Timestamp DATETIME NOT NULL DEFAULT GETDATE(),
        CONSTRAINT FK_ChatSession FOREIGN KEY (ChatSessionId) 
            REFERENCES ChatSessions(Id) ON DELETE CASCADE
    );