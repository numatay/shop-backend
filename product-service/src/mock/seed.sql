create extension if not exists "uuid-ossp";

drop database if exists task_04;

create database task_04;

drop table if exists products;
create table products (
	id uuid default uuid_generate_v4(),
	title varchar not null,
	description varchar,
	price integer,
	primary key (id)
);


drop table if exists stocks;
create table if not exists stocks (
	product_id uuid,
	count integer,
	constraint fk_product
	foreign key(product_id)
		references products(id)
);

insert into products(title, description, price)
values
	('Qara ayghyr', 'Ote jaqsy qara ayghyr', 1450.90),
	('Bie', 'Ote jaqsy bie', 1080.50);

select *
from products;

insert into stocks (product_id, count)
values
	('00c1fc61-3bf2-4d6b-b2fe-a833e2f4a65f', 2),
	('b344a53e-4ac1-4d7c-aec0-b234670024b3', 1);

select *
from stocks;