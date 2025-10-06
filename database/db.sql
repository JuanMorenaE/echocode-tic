CREATE DATABSE IF NOT EXISTS pizzumburgum;

USE pizzumburgum;



CREATE TABLE IF NOT EXISTS Clients (
    clientId int auto_increment primary key,
    clientHash varchar(36) not null,
    document varchar(20) not null,
    email varchar(200) not null,
    passwordHash varchar(32) not null,
    firstName varchar(30) not null,
    lastName varchar(30) not null,
    phoneNumber varchar(20) not null,
    birthdate date not null,
);



CREATE TABLE IF NOT EXISTS Administrators (
    adminId int auto_increment primary key,
    adminHash varchar(36) not null,
    email varchar(200) not null,
    passwordHash varchar(32) not null,
    firstName varchar(30) not null,
    lastName varchar(30) not null,
    phoneNumber varchar(20) not null,
);



CREATE TABLE IF NOT EXISTS Categories (
    categoryId int auto_increment primary key,
    categoryName varchar(20) not null,
);



CREATE TABLE IF NOT EXISTS Ingredients (
    ingredientId int auto_increment primary key,
    ingredientName varchar(20) not null,
    ingredientType bit not null,
    category int not null,
    cost float,
    isEnable boolean not null,

    foreign key (category) references Categories(categoryId)
);