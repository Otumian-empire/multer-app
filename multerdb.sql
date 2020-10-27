drop database if exists multerdb;

create database multerdb;

drop table if exists image;

create table if not exists image(
    id serial primary key,
    url varchar(255),
    created_at timestamp without time zone default current_timestamp not null
);
