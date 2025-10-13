CREATE TABLE IF NOT EXISTS users (
    userId serial primary key,
    userHash varchar(36) not null,
    email varchar(200) not null,
    passwordHash varchar(32) not null,
    firstName varchar(30) not null,
    lastName varchar(30) not null,
    phoneNumber varchar(20) not null
);



CREATE TABLE IF NOT EXISTS clients (
    userId int primary key references users(userId),
    document varchar(20) not null,
    birthdate date not null
);



CREATE TABLE IF NOT EXISTS administrators (
    userId int primary key references users(userId)
);



CREATE TABLE IF NOT EXISTS categories (
    categoryId serial primary key,
    categoryName varchar(20) unique not null
);



CREATE TABLE IF NOT EXISTS ingredients (
    ingredientId serial primary key,
    ingredientName varchar(20) not null,
    ingredientType varchar(20) check (ingredientType in ('pizza', 'burger')),
    category int references categories(categoryId),
    price numeric(10,2) not null,
    isEnabled boolean not null
);



CREATE TABLE IF NOT EXISTS sides (
    sideId serial primary key,
    sideName varchar(20) not null,
    category int references categories(categoryId),
    price numeric(10,2) not null,
    isEnabled boolean not null
);



CREATE TABLE IF NOT EXISTS creations (
    creationId serial primary key,
    ownerId int references clients(userId),
    isFavourite boolean not null,
    creationType varchar(20) check (creationType in ('pizza', 'burger')),
    size varchar(20) references pizza_sizes(sizeName)
);



CREATE TABLE IF NOT EXISTS creations_ingredients (
    creationId int references creations(creationId),
    ingredientId int references ingredients(ingredientId),
    quantity
);



CREATE TABLE IF NOT EXISTS pizza_sizes (
    sizeName varchar(20) primary key,
    price numeric(10,2) not null
);



CREATE TABLE IF NOT EXISTS orders (
    oderId serial primary key,
    orderHash varchar(36) not null,
    clientId int references clients(userId),
    orderDate timestamp default now(),
    orderStatus varchar(20) check (orderStatus in ('queued', 'preparing', 'on_the_way', 'delivered', 'cancelled')),
    total numeric(10,2) not null
);